import { toJson, JsonPrimative } from '@tstack/core';
import { testWithData } from '@tstack/jest';

const getExpectedJson = (value: PrimativeLike | [ PrimativeLike ] | { value: PrimativeLike }): JsonPrimative => {
  const jsonStr = JSON.stringify(value);
  return (typeof jsonStr === 'string') ? JSON.parse(jsonStr) : undefined;
}

type PrimativeLike = JsonPrimative | (() => void);

const primativeValues: [ PrimativeLike ][] = [
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
  }
].map(item => ([ item ]));

testWithData('primative like values', primativeValues, (primativeValue) => {
  // arrange / act / assert
  expect(toJson(primativeValue)).toEqual(getExpectedJson(primativeValue));
});

const arrayValues: [ [ PrimativeLike ] ][] = primativeValues.map(([ item ]) => ([ [ item ] ]));

testWithData('array values', arrayValues, (arrayValue) => {
  // arrange / act / assert
  expect(toJson(arrayValue)).toEqual(getExpectedJson(arrayValue));
});

const objectValues: [ { value: PrimativeLike; } ][] = primativeValues.map(([ item ]) => ([ { value: item } ]));

testWithData('object values', objectValues, (objectValue) => {
  // arrange / act / assert
  expect(toJson(objectValue)).toEqual(getExpectedJson(objectValue));
});