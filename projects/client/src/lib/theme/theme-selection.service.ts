import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { find, sort } from '@tstack/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Theme } from './theme';
import { ThemeGroup } from './theme-group';

/** used to keep track of available themes and the currently selected theme */
@Injectable({
	providedIn: 'root'
})
export class TskThemeSelectionService<ThemeClassesT extends string | '' = any> {
	updateOverlay = true;
	private _defaultThemeClass: ThemeClassesT = '' as ThemeClassesT;
	private _themeClass: ThemeClassesT = '' as ThemeClassesT;
	private _themeClassChange: BehaviorSubject<ThemeClassesT> = new BehaviorSubject(null);
	private _themeGroups: ThemeGroup<ThemeClassesT>[] = [];
	private _ungroupedThemes: Theme<ThemeClassesT>[] = [];

	get allThemes(): Theme<ThemeClassesT>[] {
		return this._themeGroups.reduce((themes, themeGroup) => {
			return themes.concat(themeGroup.themes);
		}, this._ungroupedThemes);
	}

	get defaultThemeClass(): ThemeClassesT {
		return this._defaultThemeClass;
	}
	set defaultThemeClass(defaultThemeClass: ThemeClassesT) {
		this._defaultThemeClass = defaultThemeClass;
		if (!this.theme) { this.themeClass = defaultThemeClass; }
	}

	get theme(): Theme<ThemeClassesT> {
		return find(this.allThemes, this.themeClass, 'class');
	}
	set theme(theme: Theme<ThemeClassesT>) {
		if (this.theme !== theme) {
			this.themeClass = (theme) ? theme.class : this._defaultThemeClass;
		}
	}

	get themeChange(): Observable<Theme<ThemeClassesT>> {
		return this._themeClassChange.pipe(map(() => this.theme));
	}

	get themeClass(): ThemeClassesT {
		return this._themeClass;
	}
	set themeClass(themeClass: ThemeClassesT) {
		if (this.themeClass !== themeClass) {
			const overlayClassList = this._overlayContainer.getContainerElement().classList;

			// remove the prior theme from the overlay
			if (this.updateOverlay && this.themeClass) { overlayClassList.remove(this.themeClass); }

			// update the theme
			this._themeClass = themeClass;

			// add the new theme to the overlay
			if (this.updateOverlay) { overlayClassList.add(this.themeClass); }

			// emit the change
			this._themeClassChange.next(this.themeClass);
		}
	}

	get themeClassChange(): Observable<ThemeClassesT> {
		return this._themeClassChange;
	}

	get themeGroups(): ThemeGroup<ThemeClassesT>[] {
		return this._themeGroups;
	}

	get ungroupedThemes(): Theme<ThemeClassesT>[] {
		return this._ungroupedThemes;
	}

	constructor(private _overlayContainer: OverlayContainer) { }

	addTheme(displayName: string, themeClass: ThemeClassesT, groupName?: string): void {
		const theme: Theme<ThemeClassesT> = { class: themeClass, displayName: displayName };

		if (groupName) {
			// search for an existing group with the given name
			// TODO: binary search
			const themeGroup = find(this._themeGroups, groupName, 'groupName');

			if (themeGroup) {
				// add to the existing group if it already exists
				themeGroup.themes = sort(themeGroup.themes.concat([ theme ]), 'displayName');
			} else {
				// create a new group if the group is new
				this._themeGroups = sort(this._themeGroups.concat({ groupName: groupName, themes: [ theme ] }), 'groupName');
			}
		} else {
			// add the theme as an ungrouped theme
			this._ungroupedThemes = sort(this._ungroupedThemes.concat(theme), 'displayName');
		}
	}

	addThemes(themes: Theme<ThemeClassesT>[], groupName?: string): void {
		if (themes) {
			themes.forEach(theme => {
				this.addTheme(theme.displayName, theme.class, groupName);
			});
		}
	}

	addThemeGroups(themeGroups: ThemeGroup<ThemeClassesT>[]): void {
		if (themeGroups) {
			themeGroups.forEach(themeGroup => {
				this.addThemes(themeGroup.themes, themeGroup.groupName);
			});
		}
	}
}
