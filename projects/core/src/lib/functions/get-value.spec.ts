import { getValue } from '@tstack/core';
import { testWithData } from '@tstack/jest';

type TestRecord = [ any, string | null | undefined, any ];

const mockObject = {
  id: 15,
  permissions: [ 'get', 'insert', 'update' ],
  nullProp: null,
  undefinedProp: undefined
};

const objectTestRecords: TestRecord[] = [
  // base object
  [ mockObject, '', mockObject ],
  [ mockObject, null, mockObject ],
  [ mockObject, undefined, mockObject ],
  // inner properties
  [ mockObject, 'id', mockObject.id ],
  [ mockObject, 'permissions', mockObject.permissions ],
  [ mockObject, 'permissions.0', mockObject.permissions[0] ],
  [ mockObject, 'nullProp', mockObject.nullProp ],
  [ mockObject, 'undefinedProp', mockObject.undefinedProp ],
  // undefined properties
  [ mockObject, 'missingProperty', undefined ],
  [ mockObject, 'permissions.missingProperty', undefined ]
];

testWithData('should get values from an object', objectTestRecords, (item, property, expectedResult) => {
  // arrange / act
  const result = getValue(item, property);

  // assert
  expect(result).toBe(expectedResult);
});

const mockArray = [
  12,
  'foo bar',
  mockObject,
  null,
  undefined
] as const;

const arrayTestRecords: TestRecord[] = [
  // base array
  [ mockArray, '', mockArray ],
  [ mockArray, null, mockArray ],
  [ mockArray, undefined, mockArray ],
  // inner properties
  [ mockArray, '0', mockArray[0] ],
  [ mockArray, '1', mockArray[1] ],
  [ mockArray, '2', mockArray[2] ],
  [ mockArray, '2.id', mockArray[2].id ],
  [ mockArray, '3', mockArray[3] ],
  [ mockArray, '4', mockArray[4] ],
  // undefined properties
  [ mockArray, '-1', undefined ],
  [ mockArray, '2.missingProperty', undefined ],
  [ mockArray, mockArray.length.toString(), undefined ]
];

testWithData('should get values from an array', arrayTestRecords, (item, property, expectedResult) => {
  // arrange / act
  const result = getValue(item, property);

  // assert
  expect(result).toBe(expectedResult);
});