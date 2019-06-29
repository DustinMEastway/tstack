import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { TskThemeSelectComponent } from './theme-select.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatSelectModule
	],
	declarations: [
		TskThemeSelectComponent
	],
	exports: [
		TskThemeSelectComponent
	]
})
export class TskThemeModule {}
