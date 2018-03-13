import { IRepository } from 'dme-modules/server';

export class SqlRepositoryBase<T> implements IRepository<T> {
	get(objectToGet: { id: any }): T {
		// TODO: Get from the database
		return objectToGet as any;
	}
}
