import { Component, OnInit } from '@angular/core';

import { ModuleRoute } from 'app/shared/module-routes/module-route';

@Component({
	selector: 'app-home-screen',
	templateUrl: './home-screen.component.html',
	styleUrls: [ './home-screen.component.scss' ]
})
export class HomeScreenComponent implements OnInit {
	title = 'Home';
	private _moduleRoutes: ModuleRoute[];

	get moduleRoutes(): ModuleRoute[] {
		return this._moduleRoutes;
	}

	ngOnInit(): void {
		const moduleNames = [
			'Client',
			'Core',
			'Server'
		];

		this._moduleRoutes = moduleNames.map(moduleName => {
			return { module: moduleName, route: moduleName.replace(/\s+/, '-').toLowerCase() };
		});
	}
}
