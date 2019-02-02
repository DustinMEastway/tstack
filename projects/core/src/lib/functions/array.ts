/* todo:
	* add property and sort function as a configuration for hasDuplicates
*/

import { CompareProperty } from '../types/compare-property';
import { FilterConfig } from '../types/filter-config';

import { castString, getValue } from './object';

/**
 * areSame determines if two arrays contain the same values in the same order
 * @param items1 array of items to compare with items2
 * @param items2 array of items to compare with items1
 * @returns whether the two arrays contain the same values in the same order
 */
export function areEqual(items1: any[], items2: any[]): boolean {
	if (items1 === items2) {
		return true;
	} else if (items1 == null || items2 == null || items1.length !== items2.length) {
		return false;
	}

	for (let i = 0; i < items1.length; ++i) {
		if (items1[i] !== items2[i]) {
			return false;
		}
	}

	return true;
}

/**
 * filters an array of values
 * @param items to filter
 * @param filterValue used to determine whether an item should be kept or not
 * @param [property] to compare with for each item
 * @param [config] to determine how to filter the values
 * @returns filtered items
 */
export function filter<T>(items: T[], filterValue: any, config?: FilterConfig): T[] {
	if (!(items instanceof Array)) { return []; }

	// assign the config values onto the defualt config
	config = Object.assign<FilterConfig, FilterConfig>({
		caseInsensitive: false,
		keepMatches: true,
		maxReturnSize: -1,
		mode: 'equals',
		property: ''
	}, config);

	// cast to lower case if filter is case insensitive
	const castStringConfig: { case: 'lower' | 'same' } = { case: (config.caseInsensitive) ? 'lower' : 'same' };

	// if mode is not equals or filter is case insensitive, then cast the filter value to a string
	if (config.mode !== 'equals' || config.caseInsensitive) {
		filterValue = castString(filterValue, castStringConfig);
	}

	let count = 0;
	return items.filter(item => {
		const value = getValue(item, config.property);
		let match = false;

		// determine if the item matches the filter
		if (config.mode === 'equals' && !config.caseInsensitive) {
			match = value === filterValue;
		} else {
			const stringValue = castString(value, castStringConfig);

			if (config.mode === 'equals') {
				match = stringValue === filterValue;
			} else if (config.mode === 'contains') {
				match = stringValue.includes(filterValue);
			} else if (config.mode === 'startsWith') {
				match = stringValue.startsWith(filterValue);
			}
		}

		// determine if the item should be kept based on its match
		// if match passes, then count is incremented to make sure it stays under max return size if it is used
		return (config.keepMatches === match && (config.maxReturnSize < 0 || ++count <= config.maxReturnSize));
	});
}

/**
 * finds the first item in an array of items with its nested property set to the value to find
 * @param items to search through for the value
 * @param valueToFind
 * @param [property] to look at when searching to the value to find
 * @returns found value (or null if not found)
 */
export function find<T, K extends keyof(T)>(items: T[], valueToFind: T[K], property?: K): T;
export function find<T>(items: T[], valueToFind: any, property?: string): T;
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
 * hasDuplicates determines if the array contains any duplicate values (must be sortable values like strings or numbers)
 * @param items array that is checked for duplicates
 * @returns whether any duplicates were found in the array
 */
export function hasDuplicates<T = any>(items: T[]): boolean {
	// create a copy of the array using slice before sorting to leave original array alone
	items = items.slice().sort();

	for (let i = 0; i < items.length - 1; ++i) {
		if (items[i] === items[i + 1]) {
			return true;
		}
	}

	return false;
}

/**
 * gets the value at a given property off of each element in an array
 * @param items to get values from
 * @param property get off of each item
 * @returns the value at the given property for each item in items
 */
export function pluck<T, K extends keyof(T)>(items: T[], property: K): T[K][];
export function pluck<T = any>(items: any[], property: string): T[];
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

/**
 * sort an array
 * @param items array to sort
 * @param sortProperties used to determine which item in the array is larger
 * @returns the sorted array
 */
export function sort<T = any>(items: T[], ...sortProperties: (string | CompareProperty)[]): T[] {
	return (items instanceof Array) ? items.slice().sort((item1, item2) => compareItems(item1, item2, ...sortProperties)) : [];
}
