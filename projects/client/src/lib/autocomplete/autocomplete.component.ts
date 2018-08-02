import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { combineLatest, merge, startWith, tap } from 'rxjs/operators';

import { CoerceBoolean } from '../decorators';
import { TskOption } from '../option';

@Component({
	selector: 'tsk-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: [ './autocomplete.component.scss' ]
})
// TODO: implement ControlValueAccessor
export class TskAutocompleteComponent<OptionValueT = any> implements OnInit {
	static maxDisplayedOptions = -1;
	// TODO: coerce
	@Input() autoSelect: boolean;
	@Input() maxDisplayedOptions: number;
	@Input() name: string;
	optionFilterControl = new FormControl();
	@Input() placeholder: string;
	@Input() showFilterType: boolean;
	@Input() showCaseSensitive: boolean;
	private _caseSensitive = false;
	private _caseSensitiveChange = new Subject<boolean>();
	private _filterType: 'contains' | 'startsWith' = 'contains';
	private _filterTypeChange = new Subject<'contains' | 'startsWith'>();
	private _filteredOptions: Observable<TskOption<OptionValueT>[]>;
	private _optionDisplayProperty: string;
	private _optionDisplayPropertyChange = new Subject<string>();
	private _optionValues: OptionValueT[];
	private _optionValuesChange = new Subject<OptionValueT[]>();
	private _options: TskOption<OptionValueT>[];
	private _optionsChange = new Subject<TskOption<OptionValueT>[]>();

	get caseSensitive(): boolean {
		return this._caseSensitive;
	}
	@Input() set caseSensitive(caseSensitive: boolean) {
		this._caseSensitive = caseSensitive;
		this._caseSensitiveChange.next(caseSensitive);
	}

	get filteredOptions(): Observable<TskOption<OptionValueT>[]> {
		return this._filteredOptions;
	}

	get filterType(): 'contains' | 'startsWith' {
		return this._filterType;
	}
	@Input() set filterType(filterType: 'contains' | 'startsWith') {
		this._filterType = filterType;
		this._filterTypeChange.next(filterType);
	}

	get optionDisplayProperty(): string {
		return this._optionDisplayProperty;
	}
	@Input() set optionDisplayProperty(optionDisplayProperty: string) {
		this._optionDisplayProperty = optionDisplayProperty;
		this._optionDisplayPropertyChange.next(optionDisplayProperty);
	}

	get optionValues(): OptionValueT[] {
		return this._optionValues;
	}
	@Input() set optionValues(optionValues: OptionValueT[]) {
		this._optionValues = optionValues;
		this._optionValuesChange.next(optionValues);
	}

	get options(): TskOption<OptionValueT>[] {
		return this._options;
	}
	@Input() set options(options: TskOption<OptionValueT>[]) {
		this._options = options;
		this._optionsChange.next(options);
	}

	get filterTypeIcon(): string {
		return (this.filterType === 'contains') ? 'format_align_center' : 'format_align_left';
	}

	constructor() {
		this.maxDisplayedOptions = TskAutocompleteComponent.maxDisplayedOptions;
	}

	ngOnInit(): void {
		this.setFilteredOptions();
	}

	onChangeFilterTypeClick(): void {
		this.filterType = (this.filterType === 'contains') ? 'startsWith' : this.filterType = 'contains';
	}

	private setFilteredOptions(): void {
		// options start out as options if they are set, otherwise they will try to be created
		const startingOptions = (this.options) ? this.options : TskOption.createOptions(this.optionValues, this.optionDisplayProperty);

		const optionsObservable = this._optionValuesChange.pipe(
			// if option values and a display property is specified, then the options can be created
			combineLatest(
				this._optionDisplayPropertyChange,
				(values, displayProperty) =>  TskOption.createOptions(values, displayProperty)
			),
			// if the options are directy input, then the options can be used
			merge(this._optionsChange),
			startWith(startingOptions),
			// set the options
			tap(options => { this._options = options; })
		);

		this._filteredOptions = optionsObservable.pipe(
			combineLatest(
				// combine the filter
				this.optionFilterControl.valueChanges.pipe(startWith('')),
				// combine the filter type
				this._filterTypeChange.pipe(startWith(this.filterType)),
				// combine whether the filter is case sensitive
				this._caseSensitiveChange.pipe(startWith(this.caseSensitive)),
				(options, filter: string, filterType, caseSensitive) => {
					if (!caseSensitive) { filter = filter.toUpperCase(); }

					let returnedOptions = 0;

					return options.filter((option) => {
						const displayValue = (caseSensitive) ? option.displayValue : option.displayValue.toUpperCase();
						let includeOption: boolean;

						if (filterType === 'contains') {
							includeOption = displayValue.includes(filter);
						} else if (filterType === 'startsWith') {
							includeOption = displayValue.startsWith(filter);
						} else {
							throw Error(`TskAutocompleteComponent error: invalid filter type of ${filterType}`);
						}

						// TODO: implement auto select
						if (this.autoSelect && filter === displayValue && !option.disabled) {}

						return includeOption && (this.maxDisplayedOptions < 0 || returnedOptions++ < this.maxDisplayedOptions);
					});
				}
			)
		);
	}
}
