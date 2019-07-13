import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TskThemeSelectionService } from '@tstack/client';
import { Observable } from 'rxjs';

import { Api } from 'app/entities';
import { DocumentationApiService } from 'app/services';

@Component({
	selector: 'app-root',
	templateUrl: './app-screen.component.html',
	styleUrls: ['./app-screen.component.scss']
})
export class AppScreenComponent implements OnInit {
	private _appTitle = 'TStack';
	private _searchControl = new FormControl('');

	get apiList$(): Observable<Api[]> {
		return this._documentationApiService.apiList$;
	}

	get appTitle(): string {
		return this._appTitle;
	}

	get searchControl(): FormControl {
		return this._searchControl;
	}

	get themeClass(): string {
		return this._tskThemeSelectionService.themeClass;
	}

	constructor(
		private _documentationApiService: DocumentationApiService,
		private _domSanitizer: DomSanitizer,
		private _matIconRegistry: MatIconRegistry,
		private _router: Router,
		private _tskThemeSelectionService: TskThemeSelectionService
	) { }

	ngOnInit(): void {
		this.initializeAppToolbar();
	}

	onSearch(selectedApi: Api): void {
		if (selectedApi) {
			this._router.navigateByUrl(selectedApi.path);
			this._searchControl.setValue('');
		}
	}

	private initializeAppToolbar(): void {
		// add the git icon to the icon registry
		this._matIconRegistry.addSvgIcon('github', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/github.svg'));

		// add the available themes
		this._tskThemeSelectionService.addTheme('Mat Pink Bluegrey', 'mat-pink-bluegrey-theme', 'Dark');
		this._tskThemeSelectionService.addTheme('Mat Purple Green', 'mat-purple-green-theme', 'Dark');
		this._tskThemeSelectionService.addTheme('Mat Deeppurple Amber', 'mat-deeppurple-amber-theme', 'Light');
		this._tskThemeSelectionService.addTheme('Mat Indigo Pink', 'mat-indigo-pink-theme', 'Light');
		this._tskThemeSelectionService.defaultThemeClass = 'mat-pink-bluegrey-theme';
	}
}
