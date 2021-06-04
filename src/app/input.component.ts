import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { TskAbstractControl, AbstractControlLabelSym } from './tstack-validation';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: [ './input.component.scss' ]
})
export class InputComponent {
  @Input()
  control?: AbstractControl | null;

  get controlName(): string | undefined {
    return (this.typedControl)
      ? this.typedControl[AbstractControlLabelSym]
      : undefined;
  }

  get typedControl(): FormControl & TskAbstractControl | null {
    return (this.control) ? this.control as FormControl & TskAbstractControl : null;
  }
}
