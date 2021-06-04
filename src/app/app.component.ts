import { Component, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const ObjFieldsSym = Symbol('form fields on class');
export const AbstractControlLabelSym = Symbol('abstract control name');
export const AbstractControlMessageFnSym = Symbol('abstract control message fn');

export type ValidationMessageFn = (control: AbstractControl | null) => string | null;

export type TskAbstractControl = AbstractControl & {
  [AbstractControlLabelSym]?: string;
  [AbstractControlMessageFnSym]?: ValidationMessageFn;
};

@Pipe({ name: 'tskValidationMessage' })
export class TskValidationMessagePipe implements PipeTransform {
  transform(_: ValidationErrors | null | undefined, control: AbstractControl | null): string | null {
    // use the custom message function on the control if it exists, otherwise use default
    const messageFn = (control as TskAbstractControl)[AbstractControlMessageFnSym] ?? defaultValidationMessageFn;

    return messageFn(control);
  }
}

export const defaultValidationMessageFn: ValidationMessageFn = (control: AbstractControl | null) => {
  const errors = control?.errors;
  if (!errors) {
    return null;
  }

  const name = (control as TskAbstractControl)[AbstractControlLabelSym] ?? 'Field';
  if (errors.required) {
    return `${name} is required`;
  } else if (errors.minlength) {
    return `${name} must be a minimum length of ${errors.minlength.requiredLength}`;
  } else if (errors.maxlength) {
    return `${name} must be a maximum length of ${errors.maxlength.requiredLength}`;
  }

  return `${name} is invalid`;
}

export const customValidationMessages = (overrides: ValidationMessageFn | Record<string, string>): ValidationMessageFn => {
  return control => {
    const errors = control?.errors;
    if (!errors) {
      return null;
    }

    const overrideFn = (typeof overrides === 'function')
      ? overrides
      : () => Object.keys(errors)
        .map(errorKey => overrides[errorKey])
        .find(message => !!message);

    const overrideMessage = overrideFn(control);
    if (overrideMessage) {
      return overrideMessage;
    }

    return defaultValidationMessageFn(control);
  };
}

export type FieldsT = {
  propertyKey: string;
  label: string;
  messageFn?: ValidationMessageFn;
  validators: ValidatorFn[] | undefined;
}[] | undefined;

export interface ObjectWithFields {
  [ObjFieldsSym]: FieldsT;
}

function Field(label: string, validators?: ValidatorFn[], messageFn?: ValidationMessageFn) {
  return (target: ObjectWithFields, propertyKey: string) => {
    const fields = target[ObjFieldsSym] ?? [];
    fields.push({
      label,
      messageFn,
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
    const controls: Record<string, TskAbstractControl> = {};
    this[ObjFieldsSym]?.forEach(({ label, messageFn, propertyKey, validators }) => {
      const value = this[propertyKey as keyof(this)];
      const control: TskAbstractControl = new FormControl(value, validators);
      control[AbstractControlLabelSym] = label
      control[AbstractControlMessageFnSym] = messageFn;
      controls[propertyKey] = control;
    });
    return new FormGroup(controls);
  }
}

class User extends BaseObject {
  @Field(
    'Name',
    [ Validators.required, Validators.minLength(2), Validators.maxLength(3) ],
    customValidationMessages({ required: 'Name is kind of important, please add it' })
  )
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
