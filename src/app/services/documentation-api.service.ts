import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api, Documentation } from 'app/entities';

@Injectable({ providedIn: 'root' })
export class DocumentationApiService {
	private _apiList$: Observable<Api[]>;

	get apiList$(): Observable<Api[]> {
		return this._apiList$;
	}

	constructor(private _httpClient: HttpClient) {
		this._apiList$ = this._httpClient.get<{ apis: Api[] }>(`./assets/generated/docs/api.json`).pipe(
			map(apiDoc => apiDoc.apis)
		);
	}

	getDocumentation(filePath: string): Observable<Documentation> {
		return this._httpClient.get<Object>(`./assets/generated/docs/${filePath}`).pipe(
			map(documentationJson => Documentation.cast(documentationJson))
		);
	}
}
