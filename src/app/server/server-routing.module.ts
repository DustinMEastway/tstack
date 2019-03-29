import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServerScreenComponent } from './server-screen.component';

const routes: Routes = [
	{
		path: '',
		component: ServerScreenComponent,
		children: [
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class ServerRoutingModule { }
