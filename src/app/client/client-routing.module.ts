import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientScreenComponent } from './client-screen/client-screen.component';

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
				path: 'table',
				loadChildren: './table/table.module#TableModule'
			},
			{
				path: '**',
				redirectTo: 'dynamic-content'
			}
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class ClientRoutingModule { }
