import { forwardRef, Component, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { pluck } from '@tstack/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';

import { TskOption } from '../option';

@Component({
	selector: 'tsk-select',
	templateUrl: './select.component.html',
	styleUrls: [ './select.component.scss' ],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TskSelectComponent),
			multi: true
		}
	]
})
export class TskSelectComponent<OptionValueT = any> implements ControlValueAccessor {
	/** @prop the type of form field to display */
	@Input() appearance: MatFormFieldAppearance;
	/** @prop placeholder to display in the field */
	@Input() placeholder: string;
	protected _options = new BehaviorSubject<TskOption<OptionValueT>[]>([]);
	protected _registerTouch: () => void;
	protected _registerValueChange: (value: OptionValueT) => void;
	protected _selectControl = new FormControl(null);
	protected _viewProperty: string;

	/** @prop values of the options (only use with string option values or viewProperty) */
	@Input()
	get optionValues(): OptionValueT[] {
		return pluck(this.options, 'value');
	}
	set optionValues(optionValues: OptionValueT[]) {
		this.options = TskOption.createOptions(optionValues, this.viewProperty);
	}

	/** @prop options available to select */
	@Input()
	get options(): TskOption<OptionValueT>[] {
		return this._options.value;
	}
	set options(options: TskOption<OptionValueT>[]) {
		this._options.next((options instanceof Array) ? options : []);
	}

	/** @prop selected value */
	@Input()
	get selectedValue(): OptionValueT {
		return this._selectControl.value;
	}
	set selectedValue(selectedValue: OptionValueT) {
		if (typeof this._registerValueChange === 'function') {
			this._registerValueChange(selectedValue);
		}

		this._selectControl.setValue(selectedValue);
	}

	/** @prop emits when the selected value of the autocomplete changes */
	@Output()
	get selectionChange(): Observable<OptionValueT> {
		return this._selectControl.valueChanges.pipe(skip(1), distinctUntilChanged());
	}

	/** @prop form control of the select */
	get selectControl(): FormControl {
		return this._selectControl;
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

	/** @method onFocus register that the form control has been touched */
	onFocus(): void {
		if (typeof this._registerTouch === 'function') {
			this._registerTouch();
		}
	}

	/** @method registerOnChange get the method used to notify the form that the value has changed */
	registerOnChange(registerValueChange: (value: OptionValueT) => void): void {
		this._registerValueChange = registerValueChange;
	}

	/** @method registerOnTouched get the method used to notify the form when the form field is touched */
	registerOnTouched(registerTouch: () => void): void {
		this._registerTouch = registerTouch;
	}

	/** @method writeValue set the value through the form */
	writeValue(value: OptionValueT): void {
		this.selectedValue = value;
	}
}
