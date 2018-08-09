import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ReadonlyFieldScreenComponent } from './readonly-field-screen/readonly-field-screen.component';

const routes: Routes = [
	{
		path: '',
		component: ReadonlyFieldScreenComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: HomeScreenComponent
			},
			{
				path: '**',
				redirectTo: ''
			}
		]
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class ReadonlyFieldRoutingModule { }
