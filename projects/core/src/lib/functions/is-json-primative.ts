import { JsonPrimative } from '../types';

const jsonPrimativeTypes = new Set([ 'boolean', 'number', 'string' ]);

/** Checks if @see value is a @see JsonPrimative type. */
export function isJsonPrimative(value: unknown): value is JsonPrimative {
  return value == null || jsonPrimativeTypes.has(typeof value);
}
