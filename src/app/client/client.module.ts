import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClientRoutingModule } from './client-routing.module';
import { ClientScreenComponent } from './client-screen/client-screen.component';

@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule
	],
	declarations: [
		ClientScreenComponent
	]
})
export class ClientModule { }
