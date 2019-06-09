import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExamplesModule } from 'app/examples/examples.module';

import { FunctionsRoutingModule } from './functions-routing.module';
import { FunctionsScreenComponent } from './functions-screen.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
	imports: [
		CommonModule,
		ExamplesModule,
		FunctionsRoutingModule
	],
	declarations: [
		FunctionsScreenComponent,
		ScreenComponent
	]
})
export class FunctionsModule { }
