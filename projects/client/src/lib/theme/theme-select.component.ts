import { Component } from '@angular/core';

import { Theme } from './theme';
import { ThemeGroup } from './theme-group';
import { TskThemeSelectionService } from './theme-selection.service';

/** used to change themes that exist in the theme selection service */
@Component({
	selector: 'tsk-theme-select',
	templateUrl: './theme-select.component.html',
	styleUrls: [ './theme-select.component.scss' ]
})
export class TskThemeSelectComponent {
	get themeClass(): string {
		return this._tskThemeSelectionService.themeClass;
	}
	set themeClass(themeClass: string) {
		this._tskThemeSelectionService.themeClass = themeClass;
	}

	get themeGroups(): ThemeGroup[] {
		return this._tskThemeSelectionService.themeGroups;
	}

	get ungroupedThemes(): Theme[] {
		return this._tskThemeSelectionService.ungroupedThemes;
	}

	constructor(private _tskThemeSelectionService: TskThemeSelectionService) {}
}
