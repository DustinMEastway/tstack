import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutocompleteRoutingModule } from './autocomplete-routing.module';
import { AutocompleteScreenComponent } from './autocomplete-screen/autocomplete-screen.component';

@NgModule({
	imports: [
		CommonModule,
		AutocompleteRoutingModule
	],
	declarations: [
		AutocompleteScreenComponent
	]
})
export class AutocompleteModule { }
