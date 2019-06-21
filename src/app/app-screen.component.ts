import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TskThemeSelectionService } from '@tstack/client';

@Component({
	selector: 'app-root',
	templateUrl: './app-screen.component.html',
	styleUrls: ['./app-screen.component.scss']
})
export class AppScreenComponent implements OnInit {
	private _appTitle = 'TStack';

	get appTitle(): string {
		return this._appTitle;
	}

	get themeClass(): string {
		return this._tskThemeSelectionService.themeClass;
	}

	constructor(
		private _domSanitizer: DomSanitizer,
		private _matIconRegistry: MatIconRegistry,
		private _tskThemeSelectionService: TskThemeSelectionService
	) { }

	ngOnInit(): void {
		this.initializeAppToolbar();
	}

	private initializeAppToolbar(): void {
		// add the git icon to the icon registry
		this._matIconRegistry.addSvgIcon('github', this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/github.svg'));

		// add the available themes
		this._tskThemeSelectionService.addTheme('Mat Pink Bluegrey', 'mat-pink-bluegrey-theme', 'Dark');
		this._tskThemeSelectionService.addTheme('Mat Purple Green', 'mat-purple-green-theme', 'Dark');
		this._tskThemeSelectionService.addTheme('Mat Deeppurple Amber', 'mat-deeppurple-amber-theme', 'Light');
		this._tskThemeSelectionService.addTheme('Mat Indigo Pink', 'mat-indigo-pink-theme', 'Light');
		this._tskThemeSelectionService.defaultThemeClass = 'mat-pink-bluegrey-theme';
	}
}
