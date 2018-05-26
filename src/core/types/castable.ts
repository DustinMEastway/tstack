/**
 * type that has a cast method to create an instance of itself out of anything
 */
export interface Castable<T = any> {
	new(): T;
	cast: (item: any) => T;
}
