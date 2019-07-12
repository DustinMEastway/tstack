import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TskNavMenuConfig } from './nav-menu-config';

@Component({
	selector: 'tsk-nav-menu-content',
	templateUrl: './nav-menu-content.component.html'
})
export class TskNavMenuContentComponent {
	@Input() menuItems: TskNavMenuConfig[];
	@Output() itemClick = new EventEmitter<string[]>();

	onItemClick(itemValue: string, subItemValues?: string[]): void {
		this.itemClick.emit([ itemValue ].concat(subItemValues || []));
	}
}
