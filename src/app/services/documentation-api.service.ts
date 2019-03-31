import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, zip, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { Documentation } from 'app/entities';

@Injectable({
	providedIn: 'root'
})
export class DocumentationApiService {
	constructor(private _httpClient: HttpClient) {}

	public getDocumentation(name: string): Observable<Documentation[]> {
		return this._httpClient.get<object[]>(`./assets/documentation/${name}`).pipe(
			map(result => Documentation.cast<Documentation[]>(result)),
			mergeMap(documentationGroup => this._getExampleContent(documentationGroup))
		);
	}

	private _getExampleContent(documentation: Documentation): Observable<Documentation>;
	private _getExampleContent(documentationGroup: Documentation[]): Observable<Documentation[]>;
	private _getExampleContent(
		documentationGroup: Documentation | Documentation[]
	): Observable<Documentation | Documentation[]> {
		if (documentationGroup instanceof Array) {
			// get example content for each item in the group
			return zip(
				...documentationGroup.map(documentation => this._getExampleContent(documentation))
			) as Observable<Documentation[]>;
		}

		// get content for examples with a contentFile
		const examplesContent$ = (documentationGroup.examples || []).filter(example => example.contentFile).map(example =>
			this._httpClient.get(`./app/examples/${example.contentFile}`, { responseType: 'text' }).pipe(
				tap(content => { example.content = content; })
			)
		);

		return (examplesContent$.length ? zip(...examplesContent$) : of(null)).pipe(
			map(() => documentationGroup)
		);
	}
}
