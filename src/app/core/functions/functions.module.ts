import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExamplesModule } from 'app/examples/examples.module';
import { SharedModule } from 'app/shared/shared.module';

import { ArrayScreenComponent } from './array-screen/array-screen.component';
import { FunctionsRoutingModule } from './functions-routing.module';
import { FunctionsScreenComponent } from './functions-screen.component';
import { ObjectScreenComponent } from './object-screen/object-screen.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
	imports: [
		CommonModule,
		ExamplesModule,
		SharedModule,
		FunctionsRoutingModule
	],
	declarations: [
		ArrayScreenComponent,
		FunctionsScreenComponent,
		ObjectScreenComponent,
		ScreenComponent
	]
})
export class FunctionsModule { }
