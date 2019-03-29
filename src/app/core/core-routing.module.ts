import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreScreenComponent } from './core-screen.component';
import { EntityScreenComponent } from './entity-screen/entity-screen.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: '',
		component: CoreScreenComponent,
		children: [
			{
				path: 'entity',
				component: EntityScreenComponent
			},
			{
				path: '',
				pathMatch: 'full',
				component: ScreenComponent,
			},
			{
				path: '**',
				redirectTo: ''
			}
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class CoreRoutingModule { }
