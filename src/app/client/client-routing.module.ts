import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientScreenComponent } from './client-screen.component';
import { ScreenComponent } from './screen/screen.component';

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
				path: 'readonly-field',
				loadChildren: './readonly-field/readonly-field.module#ReadonlyFieldModule'
			},
			{
				path: '',
				pathMatch: 'full',
				component: ScreenComponent,
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
