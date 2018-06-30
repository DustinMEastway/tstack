import { getValue } from './object';

/**
 * filters an array of values
 * @param items to filter
 * @param filterValue used to determine whether an item should be kept or not
 * @param [property] to compare with for each item
 * @param [keepMatches=true] to filterValue if set to true
 * @returns filtered items
 */
export function filter<T>(items: T[], filterValue: any, property?: string, keepMatches = true): T[] {
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

	return items.findIndex((item) => getValue(item, property) === valueToFind);
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
