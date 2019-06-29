import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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
