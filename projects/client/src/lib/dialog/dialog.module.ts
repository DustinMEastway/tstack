import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';

import { TskDynamicContentModule } from '../dynamic-content/dynamic-content.module';

import { TskDialogComponent } from './dialog.component';

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
	]
})
export class TskDialogModule {}
