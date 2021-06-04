import { Component, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const ObjFieldsSym = Symbol('form fields on class');
export const AbstractControlLabelSym = Symbol('abstract control name');

export type ValidationMessageFn = (control: AbstractControl | null) => string | null;

export type LabelledAbstractControl = AbstractControl & { [AbstractControlLabelSym]: string; };

@Pipe({ name: 'tskValidationMessage' })
export class TskValidationMessagePipe implements PipeTransform {
  transform(_: ValidationErrors | null | undefined, value: AbstractControl | null): string | null {
    // TODO: allow non-default message getters
    return defaultValidationMessageFn(value);
  }
}

export const defaultValidationMessageFn: ValidationMessageFn = (control: AbstractControl | null) => {
  const errors = control?.errors;
  if (!errors) {
    return null;
  }

  const name = (control as LabelledAbstractControl)[AbstractControlLabelSym] ?? 'Field';
  if (errors.required) {
    return `${name} is required`;
  } else if (errors.minlength) {
    return `${name} must be a minimum length of ${errors.minlength.requiredLength}`;
  } else if (errors.maxlength) {
    return `${name} must be a maximum length of ${errors.maxlength.requiredLength}`;
  }

  return `${name} is invalid`;
}

export type FieldsT = {
  propertyKey: string;
  label: string;
  validators: ValidatorFn[] | undefined;
}[] | undefined;

export interface ObjectWithFields {
  [ObjFieldsSym]: FieldsT;
}

function Field(label: string, validators?: ValidatorFn[]) {
  return (target: ObjectWithFields, propertyKey: string) => {
    const fields = target[ObjFieldsSym] ?? [];
    fields.push({
      label,
      propertyKey,
      validators
    });
    target[ObjFieldsSym] = fields;
  };
}

abstract class BaseObject implements ObjectWithFields {
  [ObjFieldsSym]: FieldsT;

  assign<K extends keyof(this)>(values: Pick<this, K>): this {
    Object.entries(values).forEach(([ key, value ]) => {
      this[key as keyof(this)] = value as this[keyof(this)];
    });

    return this;
  }

  toForm(): FormGroup {
    const controls: Record<string, LabelledAbstractControl> = {};
    this[ObjFieldsSym]?.forEach(({ label, propertyKey, validators }) => {
      const value = this[propertyKey as keyof(this)];
      const control = new FormControl(value, validators) as any as LabelledAbstractControl;
      control[AbstractControlLabelSym] = label
      controls[propertyKey] = control;
    });
    return new FormGroup(controls);
  }
}

class User extends BaseObject {
  @Field('Name', [ Validators.required, Validators.minLength(2), Validators.maxLength(3) ])
  name?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tstack';
  form: FormGroup;
  toLog: any;

  constructor() {
    const user = new User();
    this.form = user.toForm();
  }
}
