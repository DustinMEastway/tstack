import { Comparator } from './comparator';

/** config for the hasDuplicates method */
export interface HasDuplicatesConfig<T = any, K = any> {
	/** @prop property to pull the value used to compare items from */
	property?: K;
	/** @prop comparator function used determine if an item's value is less than, greater than or equal to another item's value */
	comparator: Comparator<T>;
}
