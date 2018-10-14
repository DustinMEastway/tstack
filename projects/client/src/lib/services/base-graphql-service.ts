import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApiService } from './base-api-service';

interface GraphQlData<T = any> {
	[field: string]: T;
}

interface GraphQlResult<T = any> {
	data: GraphQlData<T>;
}

export abstract class BaseGraphqlService extends BaseApiService {
	protected abstract get graphQlUrl(): string;

	protected queryGraphQl<T = any, R = T>(query: string, transformation?: (data: R) => T): Observable<T> {
		const observable = this.post(this.graphQlUrl, { query: `{${query}}` });

		if (typeof transformation === 'function') {
			return observable.pipe(map(data => transformation(data)));
		}

		return observable as Observable<T>;
	}

	protected queryAll<T>(query: string, castFunction?: (data: any) => T): Observable<T> {
		return this.queryGraphQl(query, (result: GraphQlResult<T>) => {
			const data = (result) ? result.data : null;

			if (data == null || Object.keys(data).length < 1) {
				return null;
			}

			// the only property on data should have the array on it
			const dataProp = Object.keys(data)[0];

			return (typeof castFunction === 'function') ? castFunction(data[dataProp]) : this._entityType.cast(data[dataProp]);
		});
	}

	protected queryOne<T>(query: string, castFunction?: (data: any) => T): Observable<T> {
		return this.queryAll(query, castFunction).pipe(map(items => (items instanceof Array) ? items[0] : items));
	}
}
