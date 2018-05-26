/**
 * an interface that all repository bases have in common
 */
export interface IBaseRepository<T> {
	get(objectToGet: { id: any }): T;
}
