import { filterStrings, FilterStringsConfig } from '@tstack/core';
import { testWithData } from '@tstack/jest';

const mockItems = [ '', 'foo', 'bar', 'foo', 'foobar', 'FooBar', 'FOO' ];

type TestRecord = [
  string[],
  string,
  Partial<FilterStringsConfig> | null,
  string[]
];

const containsItems = mockItems.filter(i => i.includes('o'));
const endsWithItems = mockItems.filter(i => i.endsWith('oo'));
const equalsItems = mockItems.filter(i => i === 'foo');
const startsWithItems = mockItems.filter(i => i.startsWith('fo'));
const caselessContainsItems = mockItems.filter(i => i.toLowerCase().includes('o'));
const caselessEndsWithItems = mockItems.filter(i => i.toLowerCase().endsWith('oo'));
const caselessEqualsItems = mockItems.filter(i => i.toLowerCase() === 'foo');
const caselessStartsWithItems = mockItems.filter(i => i.toLowerCase().startsWith('fo'));

const testRecords: TestRecord[] = [
  [ mockItems, 'foo', null, equalsItems ],
  [ mockItems, 'foo', { mode: 'equals' }, equalsItems ],
  [ mockItems, 'o', { mode: 'contains' }, containsItems ],
  [ mockItems, 'oo', { mode: 'endsWith' }, endsWithItems ],
  [ mockItems, 'fo', { mode: 'startsWith' }, startsWithItems ],
  [ mockItems, 'oo', { caseInsensitive: true, mode: 'contains' }, caselessContainsItems ],
  [ mockItems, 'oo', { caseInsensitive: true, mode: 'endsWith' },  caselessEndsWithItems],
  [ mockItems, 'fOo', { caseInsensitive: true }, caselessEqualsItems ],
  [ mockItems, 'fo', { caseInsensitive: true, mode: 'startsWith' }, caselessStartsWithItems ],
  [ mockItems, 'itemNotInMockedItems', null, [] ]
];

testWithData('should filter strings', testRecords, (items, filter, config, expectedResult) => {
  // arrange / act
  const result = filterStrings(items, filter, config as FilterStringsConfig);

  // assert
  expect(result).toEqual(expectedResult);
});