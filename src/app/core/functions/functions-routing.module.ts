import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArrayScreenComponent } from './array-screen/array-screen.component';
import { FunctionsScreenComponent } from './functions-screen.component';
import { ObjectScreenComponent } from './object-screen/object-screen.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: '',
		component: FunctionsScreenComponent,
		children: [
			{
				path: 'array',
				component: ArrayScreenComponent
			},
			{
				path: 'object',
				component: ObjectScreenComponent
			},
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
