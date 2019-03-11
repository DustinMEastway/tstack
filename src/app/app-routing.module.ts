import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: 'client',
		loadChildren: './client/client.module#ClientModule'
	},
	{
		path: 'core',
		loadChildren: './core/core.module#CoreModule'
	},
	{
		path: 'server',
		loadChildren: './server/server.module#ServerModule'
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
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
