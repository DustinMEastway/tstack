import { testWithData } from '@tstack/jest';

import { isJsonPrimative } from './is-json-primative';
import { JsonPrimative, JsonValue } from '../types';

const jsonPrimatives: [ JsonPrimative ][] = [
  [ '' ],
  [ 0 ],
  [ false ],
  [ NaN ],
  [ null ],
  [ undefined ]
];

testWithData('primative types', jsonPrimatives, (primativeValue) => {
  // arrange / act / assert
  expect(isJsonPrimative(primativeValue)).toEqual(true);
});

const nonJsonPrimatives: [ any ][] = [
  [ {} ],
  [ [] ],
  [ Symbol() ]
];

testWithData('non-primative types', nonJsonPrimatives, (nonPrimativeValue) => {
  // arrange / act / assert
  expect(isJsonPrimative(nonPrimativeValue)).toEqual(false);
});