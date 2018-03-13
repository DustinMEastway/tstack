export interface IRepository<T> {
	get(objectToGet: { id: any }): T;
}
