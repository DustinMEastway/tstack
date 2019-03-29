import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { PropertyDescription } from 'app/entities';
import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-entity-screen',
	templateUrl: './entity-screen.component.html',
	styleUrls: ['./entity-screen.component.scss']
})
export class EntityScreenComponent {
	private _staticProperties$: Observable<PropertyDescription[]>;

	get staticProperties$(): Observable<PropertyDescription[]> {
		return this._staticProperties$;
	}

	constructor(private _documentationApiService: DocumentationApiService) {
		this._staticProperties$ = this._documentationApiService.getCoreEntityDocumentation();
	}
}
