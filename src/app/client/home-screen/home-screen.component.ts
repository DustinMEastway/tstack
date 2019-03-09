import { Component, OnInit } from '@angular/core';
import { find } from '@tstack/core';

import { AppComponent } from 'app/app.component';
import { ModuleRoute } from 'app/shared/module-routes/module-route';

@Component({
	selector: 'app-home-screen',
	templateUrl: './home-screen.component.html',
	styleUrls: [ './home-screen.component.scss' ]
})
export class HomeScreenComponent implements OnInit {
	private _moduleRoutes: ModuleRoute[];
	private _title = 'Client';

	get moduleRoutes(): ModuleRoute[] {
		return this._moduleRoutes;
	}

	get title(): string {
		return this._title;
	}

	constructor(private _appComponent: AppComponent) {}

	ngOnInit(): void {
		this._moduleRoutes = find(this._appComponent.navConfigs, 'client', 'value').items.map(navConfig => ({
			module: navConfig.name,
			route: navConfig.value
		}));
	}
}
