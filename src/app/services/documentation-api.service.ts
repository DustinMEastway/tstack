import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PropertyDescription } from 'app/entities';

@Injectable({
	providedIn: 'root'
})
export class DocumentationApiService {
	constructor(private _httpClient: HttpClient) {}

	getCoreEntityDocumentation(): Observable<PropertyDescription[]> {
		return this.getDocumentation('core-entity');
	}

	private getDocumentation(name: string): Observable<PropertyDescription[]> {
		return this._httpClient.get<any>(`./assets/examples/${name}.json`).pipe(
			map(result => PropertyDescription.cast<PropertyDescription[]>(result))
		);
	}
}
