import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DynamicContentRoutingModule } from './dynamic-content-routing.module';
import { DynamicContentScreenComponent } from './dynamic-content-screen.component';

@NgModule({
	imports: [
		CommonModule,
		DynamicContentRoutingModule
	],
	declarations: [
		DynamicContentScreenComponent
	]
})
export class DynamicContentModule { }
