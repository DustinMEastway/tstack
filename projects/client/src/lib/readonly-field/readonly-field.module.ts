import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TskReadonlyFieldComponent } from './readonly-field.component';

@NgModule({
	imports: [
		CommonModule
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
