import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-screen',
	templateUrl: './screen.component.html',
	styleUrls: [ './screen.component.scss' ]
})
export class ScreenComponent {
	constructor(private _documentationApiService: DocumentationApiService, private _router: Router) {
		this.initializeContent();
	}

	documentation: any;

	private initializeContent(): void {
		this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
			const path = ((event.url === '/') ? 'index' : event.url) + '.json';
			this._documentationApiService.getDoc(path).subscribe(doc => {
				this.documentation = doc;
			});
		});
	}

}
