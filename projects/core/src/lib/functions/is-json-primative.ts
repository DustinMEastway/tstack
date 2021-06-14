import { JsonPrimative } from '../types';

/** Checks if @see value is a @see JsonPrimative type. */
export function isJsonPrimative(value: unknown): value is JsonPrimative {
  return (
    value == null
    || typeof value === 'boolean'
    || typeof value === 'number'
    || typeof value === 'string'
  );
}
