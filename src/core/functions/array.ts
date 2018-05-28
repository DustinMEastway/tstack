import { getNestedValue } from './object';

/**
 * filters an array of values
 * @param items to filter
 * @param filterValue used to determine whether an item should be kept or not
 * @param [nestedProperty] to compare with for each item
 * @param [keepMatches=true] to filterValue if set to true
 * @returns filtered items
 */
export function filter<T>(items: T[], filterValue: any, nestedProperty?: string, keepMatches = true): T[] {
	if (!(items instanceof Array)) { return []; }

	return items.filter(item => keepMatches === (getNestedValue(item, nestedProperty) === filterValue));
}

/**
 * finds the first item in an array of items with its nested property set to the value to find
 * @param items to search through for the value
 * @param valueToFind
 * @param [nestedProperty] to look at when searching to the value to find
 * @returns found value (or null if not found)
 */
export function find<T>(items: T[], valueToFind: any, nestedProperty?: string): T {
	return (items != null) ? items[findIndex(items, valueToFind, nestedProperty)] : null;
}

/**
 * finds the index of the first item in an array of items with its nested property set to the value to find
 * @param items to search through for the value
 * @param valueToFind
 * @param [nestedProperty] to look at when searching to the value to find
 * @returns found index (or -1 if not found)
 */
export function findIndex<T>(items: T[], valueToFind: any, nestedProperty?: string): number {
	if (!(items instanceof Array)) { return -1; }

	return items.findIndex((item) => getNestedValue(item, nestedProperty) === valueToFind);
}
