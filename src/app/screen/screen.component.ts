import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Documentation } from 'app/entities';
import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-screen',
	templateUrl: './screen.component.html',
	styleUrls: [ './screen.component.scss' ]
})
export class ScreenComponent {
	private _documentation$ = new BehaviorSubject<Documentation>(null);

	get documentation$(): Observable<Documentation> {
		return this._documentation$;
	}

	constructor(private _documentationApiService: DocumentationApiService, private _router: Router) {
		this.initializeDocumentionWatch();
	}

	private initializeDocumentionWatch(): void {
		this._router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			switchMap((event: NavigationEnd) =>
				this._documentationApiService.getDocumentation(((event.url === '/') ? 'index' : event.url) + '.json')
			)
		).subscribe(documentation => this._documentation$.next(documentation));
	}

}
