import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { castBoolean } from '@tstack/core';

import { TskNavMenuConfig } from './nav-menu-config';

/**
 * create a menu used for navigation
 *
 * @title Demo(s)
 * @dynamicComponent examples/client/nav-menu-nesting
 */
@Component({
	selector: 'tsk-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: [ './nav-menu.component.scss' ]
})
export class TskNavMenuComponent {
	@Output() navItemSelected = new EventEmitter<string[]>();
	@Input() menuConfig: TskNavMenuConfig;
	private _navigate: boolean;

	@Input()
	get navigate(): boolean {
		return this._navigate;
	}
	set navigate(navigate: boolean) {
		this._navigate = castBoolean(navigate);
	}

	constructor(private _router: Router) {}

	// called when a navigation anchor tag is clicked
	onNavItemClick(itemValues?: string[]): void {
		const values = [ this.menuConfig.value ].concat(itemValues || []);

		if (this.navigate) {
			// create the url by joining them together with '/' characters
			this._router.navigateByUrl(values.join('/'));
		}

		this.navItemSelected.next(values);
	}
}
