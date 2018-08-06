import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { forwardRef, Component, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption } from '@angular/material';
import { castString, find, getValue, pluck, CastStringConfig } from '@tstack/core';
import { Observable, Subject } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, startWith } from 'rxjs/operators';

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
	/** @prop default maximum number of options to display at once for tsk autocomplete components */
	static maxDisplayedOptions = -1;
	/** @prop list of mat options in the template */
	@ViewChildren(MatOption) matOptions: QueryList<MatOption>;
	/** @prop placeholder displayed in the input of the autocomplete */
	@Input() placeholder: string;
	private _autoSelect = false;
	private _disabled = false;
	private _filterConfig: TskFilterConfig;
	private _filterConfigChange = new Subject<TskFilterConfig>();
	private _filteredOptions: Observable<TskOption<OptionValueT>[]>;
	private _filteredOptionsExist = false;
	private _getViewOfValue: (value: OptionValueT) => string;
	private _optionFilterControl = new FormControl();
	private _options: TskOption<OptionValueT>[];
	private _optionsChange = new Subject<TskOption<OptionValueT>[]>();
	private _registerChange: (value: OptionValueT) => void;
	private _registerTouch: () => void;
	private _showCaseSensitive: boolean;
	private _showFilterType: boolean;
	private _value: OptionValueT;
	private _valueChange = new Subject<OptionValueT>();
	private _viewProperty: string;

	/** @prop whether typing can select the matching option or if options must be clicked */
	@Input()
	get autoSelect(): boolean {
		return this._autoSelect;
	}
	set autoSelect(autoSelect: boolean) {
		this._autoSelect = coerceBooleanProperty(autoSelect);
		if (this.filter) {
			this.selectedOption = find(this.options, this.filter, 'viewValue');
		}
	}

	/** @prop whether the filter and auto select is case sensitive */
	@Input()
	get caseSensitive(): boolean {
		return this._filterConfig.caseSensitive;
	}
	set caseSensitive(caseSensitive: boolean) {
		this._filterConfig.caseSensitive = coerceBooleanProperty(caseSensitive);
		this._filterConfigChange.next(this._filterConfig);
	}

	/** @prop emits when case sensitivity changes */
	@Output()
	get caseSensitiveChange(): Observable<boolean> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.caseSensitive), distinctUntilChanged());
	}

	/** @prop whether the input can be interacted with in the UI */
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

	/** @prop value used to filter options, update value if auto select is active and update the autocomplete's input's value */
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

	/** @prop emits when the filter value changes */
	@Output()
	get filterChange(): Observable<string> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.value), distinctUntilChanged());
	}

	/** @prop emits when any aspect of the filters configuration is updated */
	@Output()
	get filterConfigChange(): Observable<TskFilterConfig> {
		return this._filterConfigChange.pipe(startWith(this._filterConfig));
	}

	/** @prop type of filter used to determine which options should be displayed */
	@Input()
	get filterType(): 'contains' | 'startsWith' {
		return this._filterConfig.type;
	}
	set filterType(filterType: 'contains' | 'startsWith') {
		this._filterConfig.type = filterType;
		this._filterConfigChange.next(this._filterConfig);
	}

	/** @prop emits when filter type is changed */
	@Output()
	get filterTypeChange(): Observable<'contains' | 'startsWith'> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.type), distinctUntilChanged());
	}

	/** @prop mat icon ligature used to represent the current filter type in the filter type button */
	get filterTypeIcon(): string {
		return (this.filterType === 'contains') ? 'format_align_center' : 'format_align_left';
	}

	/** @prop emits when the filtered options change */
	@Output()
	get filteredOptions(): Observable<TskOption<OptionValueT>[]> {
		return this._filteredOptions;
	}

	/** @prop whether there are any options that match the current filter */
	get filteredOptionsExist(): boolean {
		return this._filteredOptionsExist;
	}

	/** @prop function used to get the view value of a value */
	get getViewOfValue(): (value: OptionValueT) => string {
		return this._getViewOfValue;
	}

	/** @prop maximum number of options to display at once (-1 to display all) */
	@Input()
	get maxDisplayedOptions(): number {
		return this._filterConfig.maxDisplayedOptions;
	}
	set maxDisplayedOptions(maxDisplayedOptions: number) {
		this._filterConfig.maxDisplayedOptions = maxDisplayedOptions;
		this._filterConfigChange.next(this._filterConfig);
	}

	/** @prop emits when maximum number of options to display is changed */
	@Output()
	get maxDisplayedOptionsChange(): Observable<number> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.maxDisplayedOptions), distinctUntilChanged());
	}

	/** @prop form control of the autocomplete's input */
	get optionFilterControl(): FormControl {
		return this._optionFilterControl;
	}

	/** @prop values of the options of the autocomplete */
	@Input()
	get optionValues(): OptionValueT[] {
		return pluck(this.options, 'value');
	}
	set optionValues(optionValues: OptionValueT[]) {
		this.options = TskOption.createOptions(optionValues, this.viewProperty);
	}

	/** @prop options of the autocomplete */
	@Input()
	get options(): TskOption<OptionValueT>[] {
		return this._options;
	}
	set options(options: TskOption<OptionValueT>[]) {
		this._options = (options instanceof Array) ? options : [];
		this._optionsChange.next(this.options);
	}

	/** @prop option currently selected by the autocomplete */
	get selectedOption(): TskOption<OptionValueT> {
		return (this.value != null) ? find(this.options, this.value, 'value') : null;
	}
	set selectedOption(selectedOption: TskOption<OptionValueT>) {
		this.value = (selectedOption) ? selectedOption.value : null;
	}

	/** @prop whether the case sensitive button should be displayed */
	@Input()
	get showCaseSensitive(): boolean {
		return this._showCaseSensitive;
	}
	set showCaseSensitive(showCaseSensitive: boolean) {
		this._showCaseSensitive = coerceBooleanProperty(showCaseSensitive);
	}

	/** @prop whether the filter type button should be displayed */
	@Input()
	get showFilterType(): boolean {
		return this._showFilterType;
	}
	set showFilterType(showFilterType: boolean) {
		this._showFilterType = coerceBooleanProperty(showFilterType);
	}

	/** @prop selected value of the autocomplete */
	@Input()
	get value(): OptionValueT {
		return this._value;
	}
	set value(value: OptionValueT) {
		this.filter = this.getViewOfValue(this.value);
		this._valueChange.next(value);
	}

	/** @prop emits when the selected value of the autocomplete changes */
	@Output()
	get valueChange(): Observable<OptionValueT> {
		return this._valueChange.pipe(startWith(this.value), distinctUntilChanged());
	}

	/** @prop property to get off of value to display in the options and use to compare options for auto select */
	@Input()
	get viewProperty(): string {
		return this._viewProperty;
	}
	set viewProperty(viewProperty: string) {
		this._viewProperty = viewProperty;
		if (this.options) {
			this.options.forEach(option => { option.viewValue = this.getViewOfValue(option.value); });
			this._optionsChange.next(this.options);
		}
	}

	constructor() {
		// set the default values for the config
		this._filterConfig = {
			caseSensitive: false,
			maxDisplayedOptions: TskAutocompleteComponent.maxDisplayedOptions,
			type: 'contains',
			value: ''
		};

		this._value = null;
		this._getViewOfValue = value => getValue(value, this.viewProperty);
	}

	/** @method ngOnInit initialize the autocomplete component */
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

	/** @method onChangeFilterTypeClick change the filter type to the next option */
	onChangeFilterTypeClick(): void {
		this.filterType = (this.filterType === 'contains') ? 'startsWith' : 'contains';
	}

	/** @method onFocus register that the form control has been touched */
	onFocus(): void {
		this._registerTouch();
	}

	/** @method registerOnChange get the method used to notify the form that the autocomplete's value has changed */
	registerOnChange(registerChange: (value: OptionValueT) => void): void {
		this._registerChange = registerChange;
	}

	/** @method registerOnTouched get the method used to notify the form when the autocomplete is touched */
	registerOnTouched(registerTouch: () => void): void {
		this._registerTouch = registerTouch;
	}

	/** @method setDisabledState set the disabled state through the form */
	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	/** @method writeValue set the value through the form */
	writeValue(value: OptionValueT): void {
		this.value = value;
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
						const viewValue = castString(option.viewValue, castStringConfig);
						let includeOption: boolean;

						if (filterType === 'contains') {
							includeOption = viewValue.includes(filter);
						} else if (filterType === 'startsWith') {
							includeOption = viewValue.startsWith(filter);
						} else {
							throw Error(`TskAutocompleteComponent error: invalid filter type of ${filterType}`);
						}

						if (this.autoSelect && filter === viewValue && !option.disabled) {
							this._valueChange.next(option.value);
						}

						return includeOption && (maxDisplayedOptions < 0 || returnedOptions++ < maxDisplayedOptions);
					});

					if (castString(this.getViewOfValue(this.value), castStringConfig) !== filter) {
						this._valueChange.next(null);
					}

					this._filteredOptionsExist = filteredOptions.length > 0;

					return filteredOptions;
				}
			)
		);
	}
}
