import { NgModule } from '@angular/core';

import { DmeAppLayoutComponent } from './app-layout/app-layout.component';

@NgModule({
	declarations: [
		DmeAppLayoutComponent
	],
	exports: [
		DmeAppLayoutComponent
	]
})
export class DmeLayoutModule {}