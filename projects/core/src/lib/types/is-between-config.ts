import { Comparator } from './comparator';

/** config for the isBetween method */
export interface IsBetweenConfig<T = any> {
	/** @prop comparator used to determine if one item is greater than, less than or equal to another */
	comparator?: Comparator<T>;
	/** @prop endpoints that value can be equal to */
	endpoints?: 'both' | 'min' | 'max' | 'neither';
}
