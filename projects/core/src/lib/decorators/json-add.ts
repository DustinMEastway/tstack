import { jsonConfigSym, CustomJsonConfig, CustomJsonType } from '../types';

/** Create an empty @see CustomJsonConfig for a @see CustomJsonType. */
export function initCustomJsonType<T extends CustomJsonType>(target: T): CustomJsonConfig {
  if (target[jsonConfigSym]) {
    return target[jsonConfigSym]!;
  }

  const targetToJson = target.toJSON;
  target.toJSON = function (this: T) {
    const baseJson = targetToJson && targetToJson.call(this) || {};
    const config = target[jsonConfigSym];
    config?.add.forEach(addProp => {
      baseJson[addProp] = this[addProp as keyof(T)] as any;
    });

    return baseJson;
  };

  return target[jsonConfigSym] = {
    add: []
  };
}

/** Add a property to an object's `JSON.stringify` output. */
export function JsonAdd() {
  return (target: CustomJsonType, propertyKey: string): void => {
    const config = initCustomJsonType(target);
    config.add.push(propertyKey);
  }
}