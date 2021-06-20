import { isJsonPrimative, JsonPrimative } from '@tstack/core';
import { testWithData } from '@tstack/jest';

const jsonPrimatives: [ JsonPrimative ][] = [
  '',
  0,
  false,
  NaN,
  null,
  undefined
].map(item => ([ item ]));

testWithData('primative types', jsonPrimatives, (primativeValue) => {
  // arrange / act / assert
  expect(isJsonPrimative(primativeValue)).toEqual(true);
});

const nonJsonPrimatives: [ unknown ][] = [
  {},
  [],
  Symbol(),
  () => {
    // intentionally left blank
  }
].map(item => ([ item ]));

testWithData('non-primative types', nonJsonPrimatives, (nonPrimativeValue) => {
  // arrange / act / assert
  expect(isJsonPrimative(nonPrimativeValue)).toEqual(false);
});