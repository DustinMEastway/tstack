/**
 * Gets a value without throwing an error if the property is not on the item.
 * @param Item to get the value off from.
 * @param Property to get.
 * @returns Value of property pulled from the item.
 */
export function getValue<T, K extends keyof(T)>(item: T, propertyToGet: K): T[K];
export function getValue<ReturnT = any, ItemT = any>(item: ItemT, propertyToGet?: string | null): ReturnT | undefined;
export function getValue<ReturnT = any, ItemT = any>(item: ItemT, propertyToGet?: string | null): ReturnT | undefined {
  const properties = (typeof propertyToGet === 'string') ? (propertyToGet ?? '').split(/[.[\]]/) : [];
  let valueToReturn: any = item;

  for (const property of properties.map(p => p.trim()).filter(p => p)) {
    if (valueToReturn != null && property in valueToReturn) {
      valueToReturn = valueToReturn[property];
    } else {
      return undefined;
    }
  }

  return valueToReturn;
}