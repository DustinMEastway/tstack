import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreScreenComponent } from './core-screen/core-screen.component';

const routes: Routes = [
	{
		path: '',
		component: CoreScreenComponent,
		children: [
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class CoreRoutingModule { }
