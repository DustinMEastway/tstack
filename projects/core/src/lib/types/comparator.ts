/**
 * function that accepts two arguments of the same type and returns a number representing which of them is larger
 * @param item1 compared against item2
 * @param item2 compared against item1
 * @returns a positive number if item1 is larger, a negative number if item2 is larger and zero if the items are equal
 */
export type Comparator<T = any> = (item1: T, item2: T) => number;
