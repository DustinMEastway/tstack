import { Pipe, PipeTransform, Type } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, ValidationErrors, ValidatorFn, Validators as NgValidators } from '@angular/forms';

export class Validators extends NgValidators {}

export const ObjFieldsSym = Symbol('form fields on class');
export const AbstractControlLabelSym = Symbol('abstract control name');
export const AbstractControlMessageFnSym = Symbol('abstract control message fn');

export type ValidationMessageFn = (control: AbstractControl | null | undefined) => string | null;

export type TskAbstractControl = AbstractControl & {
  [AbstractControlLabelSym]?: string;
  [AbstractControlMessageFnSym]?: ValidationMessageFn;
};

@Pipe({ name: 'tskValidationMessage' })
export class TskValidationMessagePipe implements PipeTransform {
  transform(_: ValidationErrors | null | undefined, control: AbstractControl | null | undefined): string | null {
    // use the custom message function on the control if it exists, otherwise use default
    const messageFn = (control as TskAbstractControl)[AbstractControlMessageFnSym] ?? defaultValidationMessageFn;

    return messageFn(control);
  }
}

export const defaultValidationMessageFn: ValidationMessageFn = control => {
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

export interface AbstractControlMetadata {
  propertyKey: string;
  label: string;
  messageFn?: ValidationMessageFn;
  type: 'field' | 'group';
  validators: ValidatorFn[] | undefined;
}

export interface GroupControlMetadata extends AbstractControlMetadata {
  groupType: Type<any>;
  type: 'group';
}

export type AbstractControlsMetadata = AbstractControlMetadata[] | undefined;

export interface ObjectWithFields {
  [ObjFieldsSym]: AbstractControlsMetadata;
}

export function Field(label: string, validators?: ValidatorFn[], messageFn?: ValidationMessageFn) {
  return (target: ObjectWithFields, propertyKey: string): void => {
    const fields = target[ObjFieldsSym] ?? [];
    fields.push({
      label,
      messageFn,
      propertyKey,
      type: 'field',
      validators
    });
    target[ObjFieldsSym] = fields;
  };
}

export function Group(label: string, validators?: ValidatorFn[], messageFn?: ValidationMessageFn) {
  return (target: ObjectWithFields, propertyKey: string): void => {
    const fields = target[ObjFieldsSym] ?? [];
    fields.push({
      label,
      messageFn,
      propertyKey,
      type: 'group',
      validators
    });
    target[ObjFieldsSym] = fields;
  };
}

export abstract class BaseObject implements ObjectWithFields {
  [ObjFieldsSym]: AbstractControlsMetadata;

  assign<K extends keyof(this)>(values: Pick<this, K>): this {
    Object.entries(values).forEach(([ key, value ]) => {
      this[key as keyof(this)] = value as this[keyof(this)];
    });

    return this;
  }

  toForm(): FormGroup {
    return BaseObject.toForm(this);
  }

  static toForm<T extends ObjectWithFields>(object: T): FormGroup {
    const controls: Record<string, TskAbstractControl> = {};
    object[ObjFieldsSym]?.forEach(controlMetadata => {
      const { label, messageFn, propertyKey, type, validators } = controlMetadata;
      const value = object[propertyKey as keyof(T)];
      let control: TskAbstractControl | null = null;

      if (value instanceof BaseObject) {
        control = value.toForm();
      } else if (type === 'field') {
        control = new FormControl(value, validators);
      }

      if (control) {
        control[AbstractControlLabelSym] = label;
        control[AbstractControlMessageFnSym] = messageFn;
        controls[propertyKey] = control;
      }
    });
    return new FormGroup(controls);
  }
}
