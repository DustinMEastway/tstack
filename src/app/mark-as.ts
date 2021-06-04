import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export type MarkAsType = 'Dirty' | 'Pending' | 'Pristine' | 'Touched' | 'Untouched';

export type MarkAsMethod = `markAs${MarkAsType}`

export function markAs(control: AbstractControl | null | undefined, type: MarkAsType): void {
  if (!control) {
    return;
  }

  // TODO: remove `as` type cast after typescript@4.3 upgrade
  const method: MarkAsMethod = `markAs${type}` as MarkAsMethod;
  control[method]();

  let subControls: AbstractControl[] = [];
  if (control instanceof FormArray) {
    subControls = control.controls;
  } else if (control instanceof FormGroup) {
    subControls = Object.values(control.controls);
  }

  subControls.forEach(c => markAs(c, type));
}
