import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TskThemeSelectionService } from '@tstack/client';

interface ThemeGroup {
	type: string;
	themes: {
		class: string;
		name: string
	}[];
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'TStack';
	private _themeClass: string;

	get themeClass(): string {
		return this._tskThemeSelectionService.themeClass;
	}

	constructor(private _domSanitizer: DomSanitizer,
		private _matIconRegistry: MatIconRegistry,
		private _tskThemeSelectionService: TskThemeSelectionService) {
	}

	ngOnInit(): void {
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
