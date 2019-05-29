import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Documentation } from 'app/entities';

@Injectable({
	providedIn: 'root'
})
export class DocumentationApiService {
	constructor(private _httpClient: HttpClient) {}

	getDocumentation(filePath: string): Observable<Documentation> {
		return this._httpClient.get<Object>(`./assets/generated/docs/${filePath}`).pipe(
			map(documentationJson => Documentation.cast(documentationJson))
		);
	}
}
