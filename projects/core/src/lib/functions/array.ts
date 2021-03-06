import { CompareProperty } from '../types/compare-property';
import { FilterConfig } from '../types/filter-config';
import { HasDuplicatesConfig } from '../types/has-duplicates-config';

import { castString, compareItems, getValue } from './object';

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
 * @param [config] used to determine how to filter the values
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
export function find<T, K extends keyof(T)>(items: T[], valueToFind: T): T;
export function find<T, K extends keyof(T)>(items: T[], valueToFind: T[K], property: K): T;
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
export function findIndex<T>(items: T[], valueToFind: T): number;
export function findIndex<T>(items: T[], valueToFind: any, property?: string): number;
export function findIndex<T>(items: T[], valueToFind: any, property?: string): number {
	if (!(items instanceof Array)) { return -1; }

	return items.findIndex(item => getValue(item, property) === valueToFind);
}

/**
 * hasDuplicates determines if the array contains any duplicate values (must be sortable values like strings or numbers)
 * @param items array that is checked for duplicates
 * @param config to customize how items are compared to determine equality @see HasDuplicatesConfig
 * @returns whether any duplicates were found in the array
 *
 * @title Example(s)
 * @dynamicComponent examples/core/has-duplicates-primatives
 * @dynamicComponent examples/core/has-duplicates-objects
 */
export function hasDuplicates<K extends keyof(T), T = any>(items: T[], config: Required<HasDuplicatesConfig<T[K], K>>): boolean;
export function hasDuplicates<T = any, C = any>(items: T[], config: Required<HasDuplicatesConfig<C, any>>): boolean;
export function hasDuplicates<T = any>(items: T[], config: { comparator(item1: T, item2: T): number; }): boolean;
export function hasDuplicates<K extends keyof(T), T = any, C = any>(items: T[], config?: HasDuplicatesConfig<C, K>): boolean;
export function hasDuplicates<T = any, C = any>(items: T[], config?: HasDuplicatesConfig<C, any>): boolean;
export function hasDuplicates(items: any[], config?: HasDuplicatesConfig<any, any>): boolean {
	config = Object.assign<HasDuplicatesConfig, HasDuplicatesConfig>({
		comparator: compareItems,
		property: ''
	}, config);

	// create a copy of the array using slice before sorting to leave original array alone
	items = items.map(item => getValue(item, config.property)).sort(config.comparator);

	for (let i = 0; i < items.length - 1; ++i) {
		if (!config.comparator(items[i], items[i + 1])) {
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

/**
 * sort an array
 * @param items array to sort
 * @param sortProperties used to determine which item in the array is larger
 * @returns the sorted array
 */
export function sort<T = any>(items: T[], ...sortProperties: (string | CompareProperty)[]): T[] {
	return (items instanceof Array) ? items.slice().sort((item1, item2) => compareItems(item1, item2, ...sortProperties)) : [];
}
