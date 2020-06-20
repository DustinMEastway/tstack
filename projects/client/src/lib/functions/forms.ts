import { AbstractControl } from '@angular/forms';
import { values } from '@tstack/core';

export type MarkAsMethod = 'markAsDirty' | 'markAsPristine' | 'markAsTouched' | 'markAsUntouched';

export type MarkAsType = 'dirty' | 'pristine' | 'touched' | 'untouched';

/**
 * marks a control and all of its sub-controls as a given type
 * @param control to mark as a given type (usually a FormGroup or FormArray)
 * @param type to mark control and sub-controls as
 */
export function markAs(
	control: AbstractControl & { controls?: { [key: string]: AbstractControl } | AbstractControl[] },
	type: MarkAsType
): void {
	if (!control || !type) { return; }

	control['markAs' + type.substr(0, 1).toUpperCase() + type.substr(1) as MarkAsMethod]();

	if (control.controls) {
		values<AbstractControl>(control.controls).forEach(childControl => { markAs(childControl, type); });
	}
}
