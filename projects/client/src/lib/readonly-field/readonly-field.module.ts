import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { TskReadonlyFieldComponent } from './readonly-field.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule
	],
	declarations: [
		TskReadonlyFieldComponent
	],
	entryComponents: [
		TskReadonlyFieldComponent
	],
	exports: [
		TskReadonlyFieldComponent
	]
})
export class TskReadonlyFieldModule {}
