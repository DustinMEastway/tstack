import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PropertyDescription } from 'app/entities';

@Injectable({
	providedIn: 'root'
})
export class DocumentationApiService {
	getCoreEntityDocumentation = this.createDocumentationGetterMethod('core-entity');

	constructor(private _httpClient: HttpClient) {}

	private createDocumentationGetterMethod(name: string): () => Observable<PropertyDescription[]> {
		return () => this._httpClient.get<object[]>(`./assets/documentation/${name}.json`).pipe(
			map(result => PropertyDescription.cast<PropertyDescription[]>(result))
		);
	}
}
