import { NgModule } from '@angular/core';

import { DynamicContentComponent } from './dynamic-content.component';

@NgModule({
	declarations: [
		DynamicContentComponent
	],
	exports: [
		DynamicContentComponent
	]
})
export class DynamicContentModule { }
