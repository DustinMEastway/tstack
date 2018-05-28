import { getNestedValue } from './object';
/**
 * filters an array of values
 * @param {T[]} items to filter
 * @param {any} filterValue used to determine whether an item should be kept or not
 * @param {string} [nestedProperty] to compare with for each item
 * @param {bookean} [keepMatches=true] to filterValue if set to true
 * @returns {T[]} filtered items
 */
export function filter(items, filterValue, nestedProperty, keepMatches = true) {
    if (!(items instanceof Array)) {
        return [];
    }
    return items.filter(item => keepMatches === (getNestedValue(item, nestedProperty) === filterValue));
}
/**
 * finds the first item in an array of items with its nested property set to the value to find
 * @param {T[]} items to search through for the value
 * @param {any} valueToFind
 * @param {string} [nestedProperty] to look at when searching to the value to find
 * @returns {T} found value (or null if not found)
 */
export function find(items, valueToFind, nestedProperty) {
    return (items != null) ? items[findIndex(items, valueToFind, nestedProperty)] : null;
}
/**
 * finds the index of the first item in an array of items with its nested property set to the value to find
 * @param {T[]} items to search through for the value
 * @param {any} valueToFind
 * @param {string} [nestedProperty] to look at when searching to the value to find
 * @param {number} found index (or -1 if not found)
 */
export function findIndex(items, valueToFind, nestedProperty) {
    if (!(items instanceof Array)) {
        return -1;
    }
    return items.findIndex((item) => getNestedValue(item, nestedProperty) === valueToFind);
}
