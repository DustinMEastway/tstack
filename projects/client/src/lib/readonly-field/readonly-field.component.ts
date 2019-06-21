import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material';
import { getValue } from '@tstack/core';

const floatingLabelScale = 0.75;
const outlineGapPadding = 5;

/**
 * The tsk-readonly-field component is used to display readonly information in a manor that is consistant with mat-form-field.
 *
 * @title Example(s)
 * Four appearance options are available to match the associated mat-form-field appearance options.
 * @dynamicComponent examples/client/readonly-field-appearance
 */
@Component({
	selector: 'tsk-readonly-field',
	templateUrl: './readonly-field.component.html',
	styleUrls: [ './readonly-field.component.scss' ]
})
export class TskReadonlyFieldComponent<ValueT = any> implements OnInit {
	@HostBinding('class.mat-form-field')
	@HostBinding('class.mat-form-field-can-float')
	@HostBinding('class.mat-form-field-should-float')
	public _addMatFormFieldClass = true;
	@HostBinding('class.mat-form-field-appearance-standard') public _addMatStandardAppearanceClass: boolean;
	@HostBinding('class.mat-form-field-appearance-fill') public _addMatFillAppearanceClass: boolean;
	@HostBinding('class.mat-form-field-appearance-outline') public _addMatOutlineAppearanceClass: boolean;
	@HostBinding('class.mat-form-field-appearance-legacy') public _addMatLegacyAppearanceClass: boolean;
	@ViewChild('connectionContainer') private _connectionContainerRef: ElementRef<HTMLDivElement>;
	@ViewChild('label') private _label: ElementRef<HTMLLabelElement>;
	private _appearance: MatFormFieldAppearance;
	private _displayWithFunction: (value: ValueT) => string;
	private _outlineGapWidth = 0;
	private _outlineGapStart = 0;
	private _placeholder: string;
	private _valueArray: ValueT[] = [];

	@Input()
	get appearance(): MatFormFieldAppearance {
		return this._appearance;
	}
	set appearance(appearance: MatFormFieldAppearance) {
		this._appearance = appearance;
		this._addMatStandardAppearanceClass = appearance === 'standard';
		this._addMatFillAppearanceClass = appearance === 'fill';
		this._addMatOutlineAppearanceClass = appearance === 'outline';
		this._addMatLegacyAppearanceClass = appearance === 'legacy';
		this.updateOutlineGap();
	}

	@Input()
	get displayWith(): ((value: ValueT) => string) | string {
		return this._displayWithFunction;
	}
	set displayWith(displayWith: ((value: ValueT) => string) | string) {
		this._displayWithFunction = (typeof displayWith === 'function') ? displayWith : (value) => getValue(value, displayWith);
	}

	get displayWithFunction(): (value: ValueT) => string {
		return this._displayWithFunction;
	}

	get outlineGapWidth(): number {
		return this._outlineGapWidth;
	}

	get outlineGapStart(): number {
		return this._outlineGapStart;
	}

	@Input()
	get placeholder(): string {
		return this._placeholder;
	}
	set placeholder(placeholder: string) {
		this._placeholder = placeholder;
		this.updateOutlineGap();
	}

	@Input()
	get value(): ValueT | ValueT[] {
		return this._valueArray;
	}
	set value(value: ValueT | ValueT[]) {
		if (value == null) {
			this._valueArray = [];
		} else {
			this._valueArray = (value instanceof Array) ? value : [ value ];
		}
	}

	get valueArray(): ValueT[] {
		return this._valueArray;
	}

	constructor() {
		// set the default appearance and its associated host classes
		this.appearance = 'legacy';
		// initialized here instead of with its declaration due to tslint concidering it a method instead of a field
		this._displayWithFunction = (value) => getValue(value);
	}

	ngOnInit(): void {
		this.updateOutlineGap();
	}

	private updateOutlineGap(): void {
		if (this.appearance === 'outline' && this.placeholder) {
			// if a label exists, then calculate the gap in the outline
			setTimeout(() => {
				const labelStart = this._label.nativeElement.children[0].getBoundingClientRect().left;
				const labelWidth = (this._label.nativeElement.children[0] as any).offsetWidth;
				const containerStart = this._connectionContainerRef.nativeElement.getBoundingClientRect().left;

				this._outlineGapStart = labelStart - containerStart - outlineGapPadding;
				this._outlineGapWidth = labelWidth * floatingLabelScale + outlineGapPadding * 2;
			});
		} else {
			this._outlineGapStart = 0;
			this._outlineGapWidth = 0;
		}
	}
}
