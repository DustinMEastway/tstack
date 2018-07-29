import { CompareProperty } from '../types/compare-property';

import { getValue } from './object';

/**
 * filters an array of values
 * @param items to filter
 * @param filterValue used to determine whether an item should be kept or not
 * @param [property] to compare with for each item
 * @param [keepMatches=true] to filterValue if set to true
 * @returns filtered items
 */
export function filter<T>(items: T[], filterValue: any, property?: string, keepMatches: boolean = true): T[] {
	if (!(items instanceof Array)) { return []; }

	return items.filter(item => keepMatches === (getValue(item, property) === filterValue));
}

/**
 * finds the first item in an array of items with its nested property set to the value to find
 * @param items to search through for the value
 * @param valueToFind
 * @param [property] to look at when searching to the value to find
 * @returns found value (or null if not found)
 */
export function find<T>(items: T[], valueToFind: any, property?: string): T {
	const index = findIndex(items, valueToFind, property);

	return (index > -1) ? items[index] : null;
}

/**
 * finds the index of the first item in an array of items with its nested property set to the value to find
 * @param items to search through for the value
 * @param valueToFind
 * @param [property] to look at when searching to the value to find
 * @returns found index (or -1 if not found)
 */
export function findIndex<T>(items: T[], valueToFind: any, property?: string): number {
	if (!(items instanceof Array)) { return -1; }

	return items.findIndex(item => getValue(item, property) === valueToFind);
}

/**
 * gets the value at a given property off of each element in an array
 * @param items to get values from
 * @param property get off of each item
 * @returns the value at the given property for each item in items
 */
export function pluck<T = any>(items: any[], property: string): T[] {
	return (items instanceof Array) ? items.map(i => getValue(i, property)) : [];
}

export function compareItems<T = any>(item1: T, item2: T, ...compareProperties: (string | CompareProperty)[]): -1 | 0 | 1 {
	if (item1 === item2) { return 0; }

	// if there are not any compare properties, then compare the full items
	if (compareProperties.length < 1) { compareProperties = [ '' ]; }

	let returnValue: -1 | 0 | 1 = 0;
	for (const compareProperty of compareProperties) {
		// get the values of each item for the current compare property
		const property = (typeof compareProperty === 'string') ? compareProperty : compareProperty.property;
		const value1 = getValue(item1, property);
		const value2 = getValue(item2, property);

		if (value1 === value2) {
			// if the values are the same, then continue to the next property
			continue;
		} else if (value1 === undefined) {
			// undefined goes at the end of the array (based on JavaScript's default sort)
			returnValue = 1;
		} else if (value1 === null) {
			// null goes after everything other than undefined
			returnValue = (value2 === undefined) ? -1 : 1;
		} else if (value2 == null) {
			// if value1 is not null or undefined and value2 is, then value2 goes after value1
			returnValue = -1;
		} else {
			// if value1 and value2 are not equal or null, then return which one is larger
			returnValue = (value1 > value2) ? 1 : -1;
		}

		// swap the return value if the compare property has ascending set to false
		return (typeof compareProperty === 'string' || compareProperty.ascending) ? returnValue : returnValue * -1 as -1 | 1;
	}

	return 0;
}

export function sort<T = any>(items: T[], ...sortProperties: (string | CompareProperty)[]): T[] {
	return items.sort((item1, item2) => compareItems(item1, item2, ...sortProperties));
}
