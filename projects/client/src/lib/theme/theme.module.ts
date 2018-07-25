import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';

import { TskThemeSelectComponent } from './theme-select.component';
import { TskThemeSelectionService } from './theme-selection.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatSelectModule
	],
	declarations: [
		TskThemeSelectComponent
	],
	providers: [
		TskThemeSelectionService
	],
	exports: [
		TskThemeSelectComponent
	]
})
export class TskThemeModule {}
