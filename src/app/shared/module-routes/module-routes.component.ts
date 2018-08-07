import { Component, Input } from '@angular/core';

import { ModuleRoute } from './module-route';

@Component({
	selector: 'app-module-routes',
	templateUrl: './module-routes.component.html',
	styleUrls: ['./module-routes.component.scss']
})
export class ModuleRoutesComponent {
	@Input() moduleRoutes: ModuleRoute[];
}
