import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { combineLatest, merge, startWith, tap } from 'rxjs/operators';

import { getValue, pluck } from '@tstack/core';

import { CoerceBoolean } from '../decorators';
import { TskOption } from '../option';

import { TskFilterConfig } from './filter-config';

@Component({
	selector: 'tsk-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: [ './autocomplete.component.scss' ]
})
// TODO: implement ControlValueAccessor
export class TskAutocompleteComponent<OptionValueT = any> implements OnInit {
	static maxDisplayedOptions = -1;
	@ViewChildren(MatOption) matOptions: QueryList<MatOption>;
	@Input() placeholder: string;
	private _autoSelect: boolean;
	private _filterConfig: TskFilterConfig;
	private _filterConfigChange: Subject<TskFilterConfig>;
	private _filteredOptions: Observable<TskOption<OptionValueT>[]>;
	private _displayProperty: string;
	private _optionFilterControl = new FormControl();
	private _options: TskOption<OptionValueT>[];
	private _optionsChange = new Subject<TskOption<OptionValueT>[]>();
	private _showFilterType: boolean;
	private _showCaseSensitive: boolean;

	@Input()
	get autoSelect(): boolean {
		return this._autoSelect;
	}
	set autoSelect(autoSelect: boolean) {
		this._autoSelect = coerceBooleanProperty(autoSelect);
	}

	@Input()
	get caseSensitive(): boolean {
		return this._filterConfig.caseSensitive;
	}
	set caseSensitive(caseSensitive: boolean) {
		this._filterConfig.caseSensitive = coerceBooleanProperty(caseSensitive);
		this._filterConfigChange.next(this._filterConfig);
	}

	@Input()
	get displayProperty(): string {
		return this._displayProperty;
	}
	set displayProperty(displayProperty: string) {
		this._displayProperty = displayProperty;
		if (this.options) {
			this.options.forEach(option => { option.displayValue = getValue(option.value, displayProperty); });
			this._optionsChange.next(this.options);
		}
	}

	@Input()
	get filter(): string {
		return this._filterConfig.value;
	}
	set filter(filter: string) {
		this._filterConfig.value = filter;
		this._filterConfigChange.next(this._filterConfig);
	}

	get filterConfigChanged(): Observable<TskFilterConfig> {
		return this._filterConfigChange.asObservable();
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

	get filterTypeIcon(): string {
		return (this.filterType === 'contains') ? 'format_align_center' : 'format_align_left';
	}

	@Input()
	get maxDisplayedOptions(): number {
		return this._filterConfig.maxDisplayedOptions;
	}
	set maxDisplayedOptions(maxDisplayedOptions: number) {
		this._filterConfig.maxDisplayedOptions = maxDisplayedOptions;
		this._filterConfigChange.next(this._filterConfig);
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

	constructor() {
		this._filterConfig = {
			caseSensitive: false,
			maxDisplayedOptions: TskAutocompleteComponent.maxDisplayedOptions,
			type: 'contains',
			value: ''
		};
		this._filterConfigChange = new Subject();
	}

	ngOnInit(): void {
		this.setFilteredOptions();

		this.optionFilterControl.valueChanges.subscribe((filterValue) => {
			this.filter = filterValue;
		});
	}

	onChangeFilterTypeClick(): void {
		this.filterType = (this.filterType === 'contains') ? 'startsWith' : 'contains';
	}

	private setFilteredOptions(): void {
		this._filteredOptions = this._optionsChange.pipe(
			startWith(this.options),
			combineLatest(
				this._filterConfigChange.pipe(startWith(this._filterConfig)),
				(options, filterConfig) => {
					const filter = (this.caseSensitive) ? filterConfig.value : filterConfig.value.toUpperCase();

					let returnedOptions = 0;

					return options.filter((option) => {
						const displayValue = (this.caseSensitive) ? option.displayValue : option.displayValue.toUpperCase();
						let includeOption: boolean;

						if (this.filterType === 'contains') {
							includeOption = displayValue.includes(filter);
						} else if (this.filterType === 'startsWith') {
							includeOption = displayValue.startsWith(filter);
						} else {
							throw Error(`TskAutocompleteComponent error: invalid filter type of ${this.filterType}`);
						}

						if (this.autoSelect && filter === displayValue && !option.disabled) {
							const matchingOption = this.matOptions.find(matOption => matOption.value === option.displayValue);
							if (!matchingOption.selected) { matchingOption.select(); }
						}

						return includeOption && (this.maxDisplayedOptions < 0 || returnedOptions++ < this.maxDisplayedOptions);
					});
				}
			)
		);
	}
}
