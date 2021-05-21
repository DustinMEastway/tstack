import { areArraysEqual } from '@tstack/core';
import { testWithData } from '@tstack/jest';

type TestRecord = [ any[] | null | undefined, any[] | null | undefined ];

const mockArray = [ false, true, '', 'foo', 0, 1, -1 ];
const trueTestRecords: TestRecord[] = [
  // null / undefined / empty arrays
  [ null, null ],
  [ undefined, undefined ],
  [ null, undefined ],
  [ undefined, null ],
  [ [], [] ],
  // same reference
  [ mockArray, mockArray ],
  // same values
  [ mockArray, mockArray.map(x => x) ]
];

testWithData('should return true', trueTestRecords, (items1, items2) => {
  // arrange / act / assert
  expect(areArraysEqual(items1, items2)).toEqual(true);
});

const falseTestRecords: TestRecord[] = [
  // single null / undefined array
  [ null, mockArray ],
  [ mockArray, undefined ],
  // less items
  [ mockArray, [] ],
  [ mockArray, mockArray.slice(1) ],
  // more items
  [ mockArray, [ ...mockArray, 'extraItem' ] ],
  // different last value
  [ mockArray, [ ...mockArray.slice(0, mockArray.length - 1), mockArray[0] ] ],
  // different first value
  [ mockArray, [ mockArray[mockArray.length - 1], ...mockArray.slice(1) ]]
];

testWithData('should return false', falseTestRecords, (items1, items2) => {
  // arrange / act / assert
  expect(areArraysEqual(items1, items2)).toEqual(false);
});

// see if equality check can return true for records that should be false
const trueWithEqualityCheck = falseTestRecords.filter(([ i1, i2 ]) =>
  i1 && i2 && i1.length === i2.length
);

expect(trueWithEqualityCheck.length).toBeGreaterThan(0);

testWithData('should return true with equality check', trueWithEqualityCheck, (items1, item2) => {
  // arrange / act / assert
  expect(areArraysEqual(items1, item2, () => true)).toEqual(true);
});

// see if equality check can return false for records that should be true
const falseWithEqualityCheck = trueTestRecords.filter(([ i1, i2 ]) =>
  i1 != i2 && i1 && i2 && i1.length === i2.length && i1.length > 0
);

expect(falseWithEqualityCheck.length).toBeGreaterThan(0);

testWithData('should return false with equality check', falseWithEqualityCheck, (items1, item2) => {
  // arrange / act / assert
  expect(areArraysEqual(items1, item2, () => false)).toEqual(false);
});