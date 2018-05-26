import { IBaseRepository } from './i-base-repository';

export class SqlBaseRepository<T> implements IBaseRepository<T> {
	/**
	 * gets the requested object from the database
	 */
	get(objectToGet: { id: any }): T {
		// TODO: Get from the database
		return objectToGet as any;
	}
}
