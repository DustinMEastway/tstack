import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CoerceBoolean } from '../decorators/coerce-boolean';

import { TskNavMenuConfig } from './nav-menu-config';

/** create a menu used for navigation */
@Component({
	selector: 'tsk-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: [ './nav-menu.component.scss' ]
})
export class TskNavMenuComponent {
	@Output() navItemSelected = new EventEmitter<string[]>();
	@Input() menuConfig: TskNavMenuConfig;
	@Input() @CoerceBoolean() navigate: boolean;

	constructor(private _router: Router) {}

	// called when a navigation anchor tag is clicked
	onNavItemClick(selectedPath: string[]): void {
		if (this.navigate) {
			// create the url by joining them together with '/' characters
			this._router.navigateByUrl(selectedPath.join('/'));
		}

		this.navItemSelected.next(selectedPath);
	}
}
