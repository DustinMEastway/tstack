import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';

import { TskNavMenuComponent } from './nav-menu.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule
	],
	declarations: [
		TskNavMenuComponent
	],
	exports: [
		TskNavMenuComponent
	]
})
export class TskNavMenuModule {}
