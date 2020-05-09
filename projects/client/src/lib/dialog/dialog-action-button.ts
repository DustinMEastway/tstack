import { ThemePalette } from '@angular/material/core';

/** action button typically used at the bottom of a dialog */
export interface TskDialogActionButton<ResultT = any> {
	/** @prop action to proform when button is clicked */
	action?: (result: ResultT) => void;
	/** @prop color of the button (based on theme) */
	color?: ThemePalette;
	/** @prop whether the button should close the dialog (defaults to true) */
	closeOnClick?: boolean;
	/** @prop type of button to use (uses mat-button if no type is specified) */
	type?: 'raised' | 'stroked';
	/** @prop viewValue to display within the button */
	viewValue: string;
	/** @prop value to pass to action if specified or to close the dialog if not */
	value?: ResultT;
}
