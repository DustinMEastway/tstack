/**
 * Determines if two arrays contain the same values in the same order.
 * @param Items to compare with @see items2.
 * @param Items to compare with @see items1.
 * @returns Whether the two arrays contain the same values in the same order.
 */
export function areArraysEqual<T>(
  items1: T[] | null | undefined,
  items2: T[] | null | undefined,
  equalityCheck?: (item1: T, item2: T) => boolean
): boolean {
  if (items1 == items2) {
    return true;
  } else if (
    items1 == null
    || items2 == null
    || items1.length !== items2.length
  ) {
    return false;
  }

  const check = equalityCheck ?? ((i1, i2) => i1 === i2);
  return items1.every((item1, index) => check(item1, items2[index]));
}