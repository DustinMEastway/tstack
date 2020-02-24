import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { TskSelectComponent } from './select.component';

@NgModule({
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatSelectModule,
		ReactiveFormsModule
	],
	declarations: [
		TskSelectComponent
	],
	exports: [
		TskSelectComponent
	]
})
export class TskSelectModule {}
