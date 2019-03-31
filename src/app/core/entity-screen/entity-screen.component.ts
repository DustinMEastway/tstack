import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Documentation } from 'app/entities';
import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-entity-screen',
	templateUrl: './entity-screen.component.html',
	styleUrls: ['./entity-screen.component.scss']
})
export class EntityScreenComponent {
	private _staticProperties$: Observable<Documentation[]>;

	get staticProperties$(): Observable<Documentation[]> {
		return this._staticProperties$;
	}

	constructor(private _documentationApiService: DocumentationApiService) {
		this._staticProperties$ = this._documentationApiService.getCoreEntityDocumentation();
	}
}
