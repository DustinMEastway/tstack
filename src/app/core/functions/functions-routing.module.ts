import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FunctionsScreenComponent } from './functions-screen.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: '',
		component: FunctionsScreenComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: ScreenComponent
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
export class FunctionsRoutingModule {}
