import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientScreenComponent } from './client-screen/client-screen.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

const routes: Routes = [
	{
		path: '',
		component: ClientScreenComponent,
		children: [
			{
				path: 'autocomplete',
				loadChildren: './autocomplete/autocomplete.module#AutocompleteModule'
			},
			{
				path: 'dynamic-content',
				loadChildren: './dynamic-content/dynamic-content.module#DynamicContentModule'
			},
			{
				path: 'nav-menu',
				loadChildren: './nav-menu/nav-menu.module#NavMenuModule'
			},
			{
				path: 'table',
				loadChildren: './table/table.module#TableModule'
			},
			{
				path: '',
				pathMatch: 'full',
				component: HomeScreenComponent,
			},
			{
				path: '**',
				redirectTo: ''
			}
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class ClientRoutingModule { }
