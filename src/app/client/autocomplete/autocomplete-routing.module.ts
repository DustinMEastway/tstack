import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutocompleteScreenComponent } from './autocomplete-screen/autocomplete-screen.component';

const routes: Routes = [
	{
		path: '',
		component: AutocompleteScreenComponent,
		children: [
		]
	}
];

@NgModule({
	imports: [	RouterModule.forChild(routes) ],
	exports: [	RouterModule ]
})
export class AutocompleteRoutingModule { }
