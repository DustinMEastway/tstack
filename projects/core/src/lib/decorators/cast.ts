import { CustomJsonType, Type } from '../types';
import { JsonAdd } from './json-add';

/** Cast the values set for a property to the specified @see type before actually setting them. */
export function Cast<PropT, ArgsT extends any[]>(type: Type<PropT, ArgsT>, args?: ArgsT) {
  return <T extends CustomJsonType, K extends string & keyof(T)>(
    target: T,
    propertyKey: K,
    descriptor?: TypedPropertyDescriptor<PropT>
  ): void => {
    // key used to store the value after it has been cast to the appropriate type
    const privateKey = Symbol.for(propertyKey);
    // convert the value to the requested type
    const convert = (value: any) => {
      if (value == null) {
        return null;
      } else if (value instanceof type) {
        return value;
      }

      return Object.assign(new type(...(args ?? []) as ArgsT), value);
    };

    // method used to access the value after it is cast if a getter is not already present
    const getter = function (this: any) { return this[privateKey] };
    // method used to cast the value and set it
    let setter: (newValue: any) => any;
    if (descriptor?.set) {
      const innerSetter = descriptor.set;
      setter = function (newValue) {
        innerSetter(convert(newValue));
      };
    } else {
      setter = function (this: any, newValue: any) {
        this[privateKey] = convert(newValue);
      }
    }

    if (descriptor) {
      // if a getter or setter already exists, then replace them as needed
      descriptor.get = descriptor.get ?? getter;
      descriptor.set = setter;
    } else {
      // add back to JSON now that it is a property
      JsonAdd()(target, propertyKey);

      // if a field exists (no getter or setter), then create a getter and setter
      if (delete target[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
    }
  }
}