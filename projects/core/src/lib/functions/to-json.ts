import { JsonObject, JsonValue } from '../types';
import { isJsonPrimative } from './is-json-primative';

/** Convert a value into into a plain JSON value */
export function toJson<T>(value: T): JsonValue {
  if (isJsonPrimative(value)) {
    if (typeof value === 'number' && isNaN(value as number)) {
      // map `NaN`` into `null`
      return null;
    }

    // leave primatives alone
    return value;
  } else if (Array.isArray(value)) {
    // map each item in arrays into their JSON values
    return value.map(item => {
      const itemJson = toJson(item)
      return (itemJson === undefined) ? null : itemJson;
    });
  } else if (typeof value === 'function') {
    return undefined;
  } else if (typeof value !== 'object') {
    // value that the method does not know how to map (e.g. a function in an array)
    return null;
  }

  // map each
  const json: JsonObject = {};
  Object.entries(value).forEach(([k, v]) => {
    const itemJson = toJson(v);
    if (itemJson !== undefined) {
      json[k] = itemJson;
    }
  });

  return json;
}