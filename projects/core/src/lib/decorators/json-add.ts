import { toJson } from '../functions';
import { jsonConfigSym, CustomJsonConfig, CustomJsonType, JsonObject } from '../types';

/** Create an empty @see CustomJsonConfig for a @see CustomJsonType. */
export function initCustomJsonType<T extends CustomJsonType>(target: T): CustomJsonConfig {
  if (target[jsonConfigSym]) {
    return target[jsonConfigSym]!;
  }

  // use the base toJSON method to start things off or use the default toJson method.
  const targetToJson = (typeof target.toJSON === 'function')
    ? target.toJSON
    : (function (this: T) { return toJson(this) as JsonObject; });

  target.toJSON = function (this: T): JsonObject {
    const baseJson = targetToJson.call(this);
    if (baseJson == null || typeof baseJson !== 'object') {
      return baseJson;
    }

    const config = target[jsonConfigSym];
    // add properties that have been configured to be added
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