import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicContentScreenComponent } from './dynamic-content-screen.component';

const routes: Routes = [
	{
		path: '',
		component: DynamicContentScreenComponent,
		children: []
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DynamicContentRoutingModule { }
