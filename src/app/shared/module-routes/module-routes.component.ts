import { Component, Input } from '@angular/core';
import { TskNavMenuConfig } from '@tstack/client';

@Component({
	selector: 'app-module-routes',
	templateUrl: './module-routes.component.html',
	styleUrls: ['./module-routes.component.scss']
})
export class ModuleRoutesComponent {
	@Input() moduleRoutes: TskNavMenuConfig[];
}
