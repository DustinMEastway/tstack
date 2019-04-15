import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Documentation } from 'app/entities';
import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-array-screen',
	templateUrl: './array-screen.component.html',
	styleUrls: ['./array-screen.component.scss']
})
export class ArrayScreenComponent implements OnInit {
	private _hasDuplicatesDocumentation$: Observable<Documentation[]>;

	get hasDuplicatesDocumentation$(): Observable<Documentation[]> {
		return this._hasDuplicatesDocumentation$;
	}

	constructor(private _documentationApiService: DocumentationApiService) {}

	ngOnInit(): void {
		this._hasDuplicatesDocumentation$ = this._documentationApiService.getDocumentation('core-functions-has-duplicates.json');
	}
}
