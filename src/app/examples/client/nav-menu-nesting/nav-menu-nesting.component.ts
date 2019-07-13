import { Component, OnInit } from '@angular/core';
import { TskNavMenuConfig } from '@tstack/client';

import { DynamicComponent } from 'app/decorators';

@DynamicComponent({ selector: 'examples/client/nav-menu-nesting' })
@Component({
	selector: 'app-nav-menu-nesting',
	templateUrl: './nav-menu-nesting.component.html'
})
export class NavMenuNestingComponent implements OnInit {
	menuConfig: TskNavMenuConfig;
	selection: string[] = [];

	ngOnInit(): void {
		this.menuConfig = {
			name: 'Gaming',
			value: 'game',
			items: [
				{ name: 'Board Games', value: 'boardgame' },
				{
					name: 'Video Games',
					value: 'videogame',
					items: [
						{ name: 'Strategy', value: 'strategy' },
						{ name: 'RPG', value: 'rpg' },
						{ name: 'Action', value: 'action' }
					]
				}
			]
		};
	}

	onItemSelected(selectedPath: string[]): void {
		this.selection = selectedPath;
	}
}
