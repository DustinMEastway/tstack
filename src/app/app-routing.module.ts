import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ValidApiRouteGuard } from 'app/services';

import { DocNotFoundComponent } from './doc-not-found/doc-not-found.component';
import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: '404',
		component: DocNotFoundComponent
	},
	{
		path: '**',
		canActivate: [ ValidApiRouteGuard ],
		component: ScreenComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
