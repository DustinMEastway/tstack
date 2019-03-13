import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TskNavMenuConfig, TskThemeSelectionService } from '@tstack/client';
import { find } from '@tstack/core';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	templateUrl: './app-screen.component.html',
	styleUrls: ['./app-screen.component.scss']
})
export class AppScreenComponent implements OnInit {
	private _activeModule: TskNavMenuConfig;
	private _appTitle = 'TStack';
	private _navConfigs: TskNavMenuConfig[];

	get activeModule(): TskNavMenuConfig {
		return this._activeModule;
	}

	get appTitle(): string {
		return this._appTitle;
	}

	get navConfigs(): TskNavMenuConfig[] {
		return this._navConfigs;
	}

	get themeClass(): string {
		return this._tskThemeSelectionService.themeClass;
	}

	constructor(
		private _domSanitizer: DomSanitizer,
		private _matIconRegistry: MatIconRegistry,
		private _router: Router,
		private _tskThemeSelectionService: TskThemeSelectionService) {
	}

	ngOnInit(): void {
		this.initializeAppToolbar();
	}

	private initializeAppToolbar(): void {
		// create the navigation menus
		this._navConfigs = [
			{
				name: 'Client',
				value: 'client',
				items: [
					{ name: 'Readonly Field', value: 'readonly-field' }
				]
			},
			{
				name: 'Core',
				value: 'core',
				items: [
					{ name: 'Entity', value: 'entity' }
				]
			}
		];

		// keep track of the active module
		this._router.events.pipe(
			filter<NavigationEnd>(event => event instanceof NavigationEnd),
			map(event => event.urlAfterRedirects.split('/').filter(route => route !== ''))
		).subscribe(routes => {
			// find the active module using the current route
			let moduleRoute = '/';
			const selectedNavigation = routes.reduce<TskNavMenuConfig>((currentModule, nextRoute, i) => {
				const nextModule = find(i ? currentModule.items : this._navConfigs, nextRoute, 'value');
				moduleRoute += nextModule.value + '/';

				return nextModule;
			}, { name: 'TStack Modules', items: this._navConfigs, value: null });

			// set the active module
			this._activeModule = {
				name: selectedNavigation.name,
				value: null,
				items: (selectedNavigation.items || []).map(navItem => ({
					name: navItem.name,
					value: moduleRoute + navItem.value
				}))
			};
		});

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
