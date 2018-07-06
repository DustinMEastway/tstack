import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
		path: '**',
		redirectTo: 'client'
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
