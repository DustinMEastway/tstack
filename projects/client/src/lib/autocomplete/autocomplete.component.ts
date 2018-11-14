/* todo:
	* use the @tstack/core filter function
	* add label property that defaults to placeholder if it is not set
	* set the matInput's value when writeValue is called
	* allow for injectable configs like material and move the default maxDisplayedOptions into it
*/

import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import {
	forwardRef,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	Output,
	QueryList,
	ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete, MatFormFieldAppearance, MatOption } from '@angular/material';
import { castString, find, getValue, pluck, CastStringConfig } from '@tstack/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { TskOption } from '../option';

import { TskFilterConfig } from './filter-config';

/** used to display an autocomplete with some features (such as several filter types) built in */
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
export class TskAutocompleteComponent<OptionValueT = any> implements AfterViewInit, ControlValueAccessor, OnInit {
	/** @prop default maximum number of options to display at once for tsk autocomplete components */
	static maxDisplayedOptions = -1;
	/** @prop the type of form field to display */
	@Input() appearance: MatFormFieldAppearance;
	/** @prop the material autocomplete */
	@ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
	/** @prop placeholder displayed in the input of the autocomplete */
	@Input() placeholder: string;
	private _autoSelect = false;
	private _filterConfigChange: BehaviorSubject<TskFilterConfig>;
	private _filteredOptions: Observable<TskOption<OptionValueT>[]>;
	private _filteredOptionsExist = false;
	private _getViewOfValue: (value: OptionValueT) => string;
	private _optionFilterControl = new FormControl();
	private _optionsChange = new BehaviorSubject<TskOption<OptionValueT>[]>([]);
	private _registerTouch: () => void;
	private _registerValueChange: (value: OptionValueT) => void;
	private _selectedValueChange = new BehaviorSubject<OptionValueT>(null);
	private _showCaseSensitive: boolean;
	private _showFilterType: boolean;
	private _viewProperty: string;

	/** @prop whether typing can select the matching option or if options must be clicked */
	@Input()
	get autoSelect(): boolean {
		return this._autoSelect;
	}
	set autoSelect(autoSelect: boolean) {
		this._autoSelect = coerceBooleanProperty(autoSelect);

		// select the matching option
		if (this.autoSelect) {
			this.selectedOption = find(this.options, this.filter, 'viewValue');
		}
	}

	/** @prop whether the filter and auto select is case sensitive */
	@Input()
	get caseSensitive(): boolean {
		return this.filterConfig.caseSensitive;
	}
	set caseSensitive(caseSensitive: boolean) {
		this.filterConfig.caseSensitive = coerceBooleanProperty(caseSensitive);
		this._filterConfigChange.next(this.filterConfig);
	}

	/** @prop emits when case sensitivity changes */
	@Output()
	get caseSensitiveChange(): Observable<boolean> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.caseSensitive), distinctUntilChanged());
	}

	/** @prop whether the input can be interacted with in the UI */
	@Input()
	get disabled(): boolean {
		return this.optionFilterControl.disabled;
	}
	set disabled(disabled: boolean) {
		disabled = coerceBooleanProperty(disabled);
		if (this.disabled !== disabled) {
			this.optionFilterControl.disable();
		} else {
			this.optionFilterControl.enable();
		}
	}

	/** @prop value used to filter options, update value if auto select is active and update the autocomplete's input's value */
	@Input()
	get filter(): string {
		return this.filterConfig.value;
	}
	set filter(filter: string) {
		this.filterConfig.value = filter;
		this._filterConfigChange.next(this.filterConfig);
	}

	/** @prop emits when the filter value changes */
	@Output()
	get filterChange(): Observable<string> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.value), distinctUntilChanged());
	}

	/** @prop full configuration used to filter options */
	get filterConfig(): TskFilterConfig {
		return this._filterConfigChange.value;
	}
	set filterConfig(filterConfig: TskFilterConfig) {
		Object.assign(this.filterConfig, filterConfig);
		this._filterConfigChange.next(this.filterConfig);
	}

	/** @prop emits when any aspect of the filters configuration is updated */
	@Output()
	get filterConfigChange(): Observable<TskFilterConfig> {
		return this._filterConfigChange.asObservable();
	}

	/** @prop type of filter used to determine which options should be displayed */
	@Input()
	get filterType(): 'contains' | 'startsWith' {
		return this.filterConfig.type;
	}
	set filterType(filterType: 'contains' | 'startsWith') {
		this.filterConfig.type = filterType;
		this._filterConfigChange.next(this.filterConfig);
	}

	/** @prop emits when filter type is changed */
	@Output()
	get filterTypeChange(): Observable<'contains' | 'startsWith'> {
		return this.filterConfigChange.pipe(map(filterConfig => filterConfig.type), distinctUntilChanged());
	}

	/** @prop mat icon ligature used to represent the current filter type in the filter type button */
	get filterTypeIcon(): 'format_align_center' | 'format_align_left' {
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
		return this.filterConfig.maxDisplayedOptions;
	}
	set maxDisplayedOptions(maxDisplayedOptions: number) {
		maxDisplayedOptions = coerceNumberProperty(maxDisplayedOptions);
		this.filterConfig.maxDisplayedOptions = (maxDisplayedOptions === -1 || maxDisplayedOptions > 0) ?
			maxDisplayedOptions : TskAutocompleteComponent.maxDisplayedOptions;
		this._filterConfigChange.next(this.filterConfig);
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
		return this._optionsChange.value;
	}
	set options(options: TskOption<OptionValueT>[]) {
		this._optionsChange.next((options instanceof Array) ? options : []);
	}

	/** @prop option currently selected by the autocomplete */
	get selectedOption(): TskOption<OptionValueT> {
		return (this.value != null) ? find(this.options, this.value, 'value') : null;
	}
	set selectedOption(selectedOption: TskOption<OptionValueT>) {
		this.selectedValue = (selectedOption) ? selectedOption.value : null;
	}

	/** @prop the value associated with the selected option */
	@Input()
	get selectedValue(): OptionValueT {
		return this._selectedValueChange.value;
	}
	set selectedValue(selectedValue: OptionValueT) {
		if (this.selectedValue !== selectedValue) {
			this._selectedValueChange.next(selectedValue);
			this.value = selectedValue;
			this.setSelectedMatOption(selectedValue);
			this._registerValueChange(selectedValue);
		}
	}

	/** @prop emits when the selected value of the autocomplete changes */
	@Output()
	get selectedValueChange(): Observable<OptionValueT> {
		return this._selectedValueChange.asObservable();
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
	get value(): OptionValueT | string {
		return this.optionFilterControl.value;
	}
	set value(value: OptionValueT | string) {
		if (this.value !== value) {
			this.optionFilterControl.setValue(value);
		}
	}

	/** @prop emits when the value of the filter or control changes */
	get valueChange(): Observable<OptionValueT | string> {
		return this.optionFilterControl.valueChanges.pipe(distinctUntilChanged());
	}

	/** @prop property to get off of value to display in the options and use to compare options for auto select */
	@Input()
	get viewProperty(): string {
		return this._viewProperty;
	}
	set viewProperty(viewProperty: string) {
		this._viewProperty = viewProperty;
		this.options = TskOption.createOptions(this.optionValues, this.viewProperty);
	}

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
		// set the default values for the config
		this._filterConfigChange = new BehaviorSubject<TskFilterConfig>({
			caseSensitive: false,
			maxDisplayedOptions: TskAutocompleteComponent.maxDisplayedOptions,
			type: 'contains',
			value: ''
		});

		this._getViewOfValue = value => getValue(value, this.viewProperty);
	}

	/** @method ngOnInit initialize the autocomplete component */
	ngOnInit(): void {
		this.optionFilterControl.valueChanges.subscribe((controlValue: OptionValueT | string) => {
			this.filter = (typeof controlValue === 'string') ? controlValue : this.getViewOfValue(controlValue);
		});

		// set up the filtered options for the autocomplete
		this.setFilteredOptions();
	}

	/** @method ngAfterViewInit finish itializing properties that are not available by ngOnInit */
	ngAfterViewInit(): void {
		this.matAutocomplete.options.changes.subscribe((matOptions: MatOption[]) => {
			this.setSelectedMatOption(this.selectedValue);
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
	registerOnChange(registerValueChange: (value: OptionValueT) => void): void {
		this._registerValueChange = registerValueChange;
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
	writeValue(value: OptionValueT | string): void {
		this.value = value;
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
					const castFilter = castString(filter, castStringConfig);

					let returnedOptions = 0;

					const filteredOptions = options.filter((option) => {
						const viewValue = castString(option.viewValue, castStringConfig);
						let includeOption: boolean;

						if (filterType === 'contains') {
							includeOption = viewValue.includes(castFilter);
						} else if (filterType === 'startsWith') {
							includeOption = viewValue.startsWith(castFilter);
						} else {
							throw Error(`TskAutocompleteComponent error: invalid filter type of ${filterType}`);
						}

						if (this.autoSelect && viewValue === castFilter) {
							this.setSelectedMatOption(option.value);
							this._selectedValueChange.next(option.value);
						}

						return includeOption && (maxDisplayedOptions < 0 || returnedOptions++ < maxDisplayedOptions);
					});

					if (this.autoSelect && this.selectedValue && castString(this.getViewOfValue(this.selectedValue), castStringConfig) !== castFilter) {
						this.setSelectedMatOption(null);
						this._selectedValueChange.next(null);
					}

					this._filteredOptionsExist = filteredOptions.length > 0;

					return filteredOptions;
				}
			)
		);
	}

	private setSelectedMatOption(selectedValue: OptionValueT): void {
		this.matAutocomplete.options.forEach((matOption: MatOption) => {
			// setting a private property due the deselect method calling optionSelected
			matOption['_selected'] = matOption.value === selectedValue;
		});

		// register the changes that just occured
		this._changeDetectorRef.detectChanges();
	}
}
