import { HttpClient } from '@angular/common/http';
import { Castable } from '@tstack/core';
import { Observable } from 'rxjs';

export abstract class BaseApiService<EntityT = any> {
	protected abstract _entityType: Castable<EntityT>;
	protected abstract _httpClient: HttpClient;

	protected abstract get serverUrl(): string;

	protected post<ReturnT = any>(url: string, body?: any): Observable<ReturnT> {
		return this._httpClient.post<ReturnT>(url, body);
	}
}
