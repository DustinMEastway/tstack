import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { forwardRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete, MatOption } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, merge, startWith, tap } from 'rxjs/operators';

import { castString, find, getValue, pluck, CastStringConfig } from '@tstack/core';

import { CoerceBoolean } from '../decorators';
import { TskOption } from '../option';

import { TskFilterConfig } from './filter-config';

@Component({
	selector: 'tsk-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: [ './autocomplete.component.scss' ],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TskAutocompleteComponent),
			multi: true
		}
	]
})
export class TskAutocompleteComponent<OptionValueT = any> implements ControlValueAccessor, OnInit {
	static maxDisplayedOptions = -1;
	@ViewChildren(MatOption) matOptions: QueryList<MatOption>;
	@Input() placeholder: string;
	private _autoSelect: boolean;
	private _disabled: boolean;
	private _getViewOfValue: (value: OptionValueT) => string;
	private _filterConfig: TskFilterConfig;
	private _filterConfigChange = new Subject<TskFilterConfig>();
	private _filteredOptions: Observable<TskOption<OptionValueT>[]>;
	private _displayProperty: string;
	private _optionFilterControl = new FormControl();
	private _options: TskOption<OptionValueT>[];
	private _optionsChange = new Subject<TskOption<OptionValueT>[]>();
	private _registerChange: (value: OptionValueT) => void;
	private _registerTouch: () => void;
	private _showFilterType: boolean;
	private _showCaseSensitive: boolean;
	private _value: OptionValueT;
	private _valueChange = new Subject<OptionValueT>();

	@Input()
	get autoSelect(): boolean {
		return this._autoSelect;
	}
	set autoSelect(autoSelect: boolean) {
		this._autoSelect = coerceBooleanProperty(autoSelect);
		if (this.filter) {
			this.selectedOption = find(this.options, this.filter, 'displayValue');
		}
	}

	@Input()
	get caseSensitive(): boolean {
		return this._filterConfig.caseSensitive;
	}
	set caseSensitive(caseSensitive: boolean) {
		this._filterConfig.caseSensitive = coerceBooleanProperty(caseSensitive);
		this._filterConfigChange.next(this._filterConfig);
	}

	get caseSensitiveChange(): Observable<boolean> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.caseSensitive), distinctUntilChanged());
	}

	@Input()
	get disabled(): boolean {
		return this._disabled;
	}
	set disabled(disabled: boolean) {
		this._disabled = coerceBooleanProperty(disabled);
		if (this._disabled) {
			this.optionFilterControl.disable();
		} else {
			this.optionFilterControl.enable();
		}
	}

	@Input()
	get displayProperty(): string {
		return this._displayProperty;
	}
	set displayProperty(displayProperty: string) {
		this._displayProperty = displayProperty;
		if (this.options) {
			this.options.forEach(option => { option.displayValue = this.getViewOfValue(option.value); });
			this._optionsChange.next(this.options);
		}
	}

	get getViewOfValue(): (value: OptionValueT) => string {
		return this._getViewOfValue;
	}

	@Input()
	get filter(): string {
		return this._filterConfig.value;
	}
	set filter(filter: string) {
		this._filterConfig.value = filter;
		this._filterConfigChange.next(this._filterConfig);
		if (this.optionFilterControl.value !== filter && typeof this.optionFilterControl.value !== 'object') {
			this.optionFilterControl.setValue(filter);
		}
	}

	get filterChange(): Observable<string> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.value), distinctUntilChanged());
	}

	get filterConfigChange(): Observable<TskFilterConfig> {
		return this._filterConfigChange.pipe(startWith(this._filterConfig));
	}

	get filteredOptions(): Observable<TskOption<OptionValueT>[]> {
		return this._filteredOptions;
	}

	@Input()
	get filterType(): 'contains' | 'startsWith' {
		return this._filterConfig.type;
	}
	set filterType(filterType: 'contains' | 'startsWith') {
		this._filterConfig.type = filterType;
		this._filterConfigChange.next(this._filterConfig);
	}

	get filterTypeChange(): Observable<'contains' | 'startsWith'> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.type), distinctUntilChanged());
	}

	get filterTypeIcon(): string {
		return (this.filterType === 'contains') ? 'format_align_center' : 'format_align_left';
	}

	get optionFilterControl(): FormControl {
		return this._optionFilterControl;
	}

	@Input()
	get optionValues(): OptionValueT[] {
		return pluck(this.options, 'value');
	}
	set optionValues(optionValues: OptionValueT[]) {
		this._options = (optionValues instanceof Array) ? TskOption.createOptions(optionValues, this.displayProperty) : [];
		this._optionsChange.next(this.options);
	}

	@Input()
	get options(): TskOption<OptionValueT>[] {
		return this._options;
	}
	set options(options: TskOption<OptionValueT>[]) {
		this._options = (options instanceof Array) ? options : [];
		this._optionsChange.next(this.options);
	}

	@Input()
	get maxDisplayedOptions(): number {
		return this._filterConfig.maxDisplayedOptions;
	}
	set maxDisplayedOptions(maxDisplayedOptions: number) {
		this._filterConfig.maxDisplayedOptions = maxDisplayedOptions;
		this._filterConfigChange.next(this._filterConfig);
	}

	get maxDisplayedOptionsChange(): Observable<number> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.maxDisplayedOptions), distinctUntilChanged());
	}

	get selectedOption(): TskOption<OptionValueT> {
		return (this.value != null) ? find(this.options, this.value, 'value') : null;
	}
	set selectedOption(selectedOption: TskOption<OptionValueT>) {
		this.value = (selectedOption) ? selectedOption.value : null;
	}

	@Input()
	get showFilterType(): boolean {
		return this._showFilterType;
	}
	set showFilterType(showFilterType: boolean) {
		this._showFilterType = coerceBooleanProperty(showFilterType);
	}

	@Input()
	get showCaseSensitive(): boolean {
		return this._showCaseSensitive;
	}
	set showCaseSensitive(showCaseSensitive: boolean) {
		this._showCaseSensitive = coerceBooleanProperty(showCaseSensitive);
	}

	@Input()
	get value(): OptionValueT {
		return this._value;
	}
	set value(value: OptionValueT) {
		this.filter = this.getViewOfValue(this.value);
		this._valueChange.next(value);
	}

	get valueChange(): Observable<OptionValueT> {
		return this._valueChange.pipe(startWith(this.value), distinctUntilChanged());
	}

	constructor() {
		this._filterConfig = {
			caseSensitive: false,
			maxDisplayedOptions: TskAutocompleteComponent.maxDisplayedOptions,
			type: 'contains',
			value: ''
		};
		this._value = null;
		this._getViewOfValue = value => getValue(value, this.displayProperty);
	}

	ngOnInit(): void {
		// set up the filtered options for the autocomplete
		this.setFilteredOptions();

		// set the inital value of the option filter
		this.optionFilterControl.setValue(this._filterConfig.value);

		// set the needed fields & update the mat options when the value changes
		this.valueChange.subscribe(value => {
			this.onValueChange(value);
		});
	}

	/* TODO: Move */
	onOptionFilterInput(filter: string): void {
		this.filter = filter;
	}

	onOptionSelected(value: OptionValueT): void {
		this.filter = this.getViewOfValue(value);
		this._valueChange.next(value);
	}
	/* TODO: Move */

	onChangeFilterTypeClick(): void {
		this.filterType = (this.filterType === 'contains') ? 'startsWith' : 'contains';
	}

	onFocus(): void {
		this._registerTouch();
	}

	registerOnChange(registerChange: (value: OptionValueT) => void): void {
		this._registerChange = registerChange;
	}

	registerOnTouched(registerTouch: () => void): void {
		this._registerTouch = registerTouch;
	}

	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	writeValue(value: OptionValueT): void {
		this._value = value;
		this.filter = getValue(value, this.displayProperty);
	}

	private onValueChange(value: OptionValueT): void {
		if (this._value !== value) {
			// set the new value
			this._value = value;

			// update the selected option
			if (this.matOptions) {
				this.matOptions.forEach(option => {
					if (option.value === value) {
						option.select();
					} else {
						option.deselect();
					}
				});
			}

			// register the change
			if (typeof this._registerChange === 'function') {
				this._registerChange(this.value);
			}
		}
	}

	private setFilteredOptions(): void {
		this._filteredOptions = this._optionsChange.pipe(
			startWith(this.options),
			combineLatest(
				this.caseSensitiveChange,
				this.filterChange,
				this.filterTypeChange,
				this.maxDisplayedOptionsChange,
				(options, caseSensitive, filter, filterType, maxDisplayedOptions) => {
					const castStringConfig: CastStringConfig = { case: (caseSensitive) ? 'same' : 'upper' };
					filter = castString(filter, castStringConfig);

					let returnedOptions = 0;

					const filteredOptions = options.filter((option) => {
						const displayValue = castString(option.displayValue, castStringConfig);
						let includeOption: boolean;

						if (filterType === 'contains') {
							includeOption = displayValue.includes(filter);
						} else if (filterType === 'startsWith') {
							includeOption = displayValue.startsWith(filter);
						} else {
							throw Error(`TskAutocompleteComponent error: invalid filter type of ${filterType}`);
						}

						if (this.autoSelect && filter === displayValue && !option.disabled) {
							this._valueChange.next(option.value);
						}

						return includeOption && (maxDisplayedOptions < 0 || returnedOptions++ < maxDisplayedOptions);
					});

					if (castString(this.getViewOfValue(this.value), castStringConfig) !== filter) {
						this._valueChange.next(null);
					}

					return filteredOptions;
				}
			)
		);
	}
}
