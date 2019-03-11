import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavMenuScreenComponent } from './nav-menu-screen.component';

const routes: Routes = [
	{
		path: '',
		component: NavMenuScreenComponent,
		children: []
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class NavMenuRoutingModule { }
