import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TskDynamicContentModule } from '../dynamic-content/dynamic-content.module';

import { TskDialogComponent } from './dialog.component';
import { TskDialogService } from './dialog.service';

@NgModule({
	declarations: [
		TskDialogComponent
	],
	entryComponents: [
		TskDialogComponent
	],
	exports: [
		TskDialogComponent
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
		TskDynamicContentModule
	],
	providers: [
		TskDialogService
	]
})
export class TskDialogModule {}
