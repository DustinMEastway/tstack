import { toJson, JsonPrimative } from '@tstack/core';
import { testWithData } from '@tstack/jest';

const getExpectedJson = (value: ShallowValue | [ ShallowValue ] | { value: ShallowValue }): JsonPrimative => {
  const jsonStr = JSON.stringify(value);
  return (typeof jsonStr === 'string') ? JSON.parse(jsonStr) : undefined;
}

type ShallowValue = JsonPrimative | (() => void) | symbol;

const shallowValues: [ ShallowValue ][] = [
  null,
  undefined,
  NaN,
  '',
  'foobar',
  0,
  -1,
  12,
  false,
  true,
  () => {
    // intentionally left blank
  },
  Symbol(),
  Symbol.for('foo')
].map(item => ([ item ]));

testWithData('shallow values', shallowValues, (primativeValue) => {
  // arrange / act / assert
  expect(toJson(primativeValue)).toEqual(getExpectedJson(primativeValue));
});

const arrayValues: [ [ ShallowValue ] ][] = shallowValues.map(([ item ]) => ([ [ item ] ]));

testWithData('array values', arrayValues, (arrayValue) => {
  // arrange / act / assert
  expect(toJson(arrayValue)).toEqual(getExpectedJson(arrayValue));
});

const objectValues: [ { value: ShallowValue; } ][] = shallowValues.map(([ item ]) => ([ { value: item } ]));

testWithData('object values', objectValues, (objectValue) => {
  // arrange / act / assert
  expect(toJson(objectValue)).toEqual(getExpectedJson(objectValue));
});