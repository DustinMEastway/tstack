import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TskBaseApiService } from './base-api-service';

interface GraphQlResult<T = any> {
	data?: { [key: string]: T };
	errors?: { message: string}[];
}

export abstract class TskBaseGraphqlService extends TskBaseApiService {
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
			if (!result) {
				throw new Error(`query '${query}' returned no result`);
			} else if (result.errors instanceof Array) {
				const errorMessages = result.errors.map(e => e.message).join('\', \'');
				throw new Error(`query '${query}' returned the folowing erors ['${errorMessages}']`);
			}

			const data = result.data;

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
