import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ReadonlyFieldRoutingModule } from './readonly-field-routing.module';
import { ReadonlyFieldScreenComponent } from './readonly-field-screen/readonly-field-screen.component';

@NgModule({
	imports: [
		CommonModule,
		ReadonlyFieldRoutingModule
	],
	declarations: [
		ReadonlyFieldScreenComponent,
		HomeScreenComponent
	]
})
export class ReadonlyFieldModule { }
