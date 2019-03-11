import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenComponent } from './screen/screen.component';
import { ReadonlyFieldScreenComponent } from './readonly-field-screen.component';

const routes: Routes = [
	{
		path: '',
		component: ReadonlyFieldScreenComponent,
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
export class ReadonlyFieldRoutingModule {}
