import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { TskAutocompleteComponent } from './autocomplete.component';

@NgModule({
	imports: [
		CommonModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		ReactiveFormsModule
	],
	declarations: [
		TskAutocompleteComponent
	],
	exports: [
		TskAutocompleteComponent
	]
})
export class TskAutocompleteModule { }
