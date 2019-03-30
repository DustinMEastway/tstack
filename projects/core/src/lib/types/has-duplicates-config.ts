export interface HasDuplicatesConfig<T = any, K = any> {
	/** @prop property to pull the value used to compare items from */
	property?: K;
	/** @prop comparator function used determine if an item's value is less than, greater than or equal to another item's value */
	comparator?(item1: T, item2: T): number;
}
