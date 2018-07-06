import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { ClientRoutingModule } from './client-routing.module';
import { ClientScreenComponent } from './client-screen/client-screen.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatToolbarModule,
		ClientRoutingModule
	],
	declarations: [
		ClientScreenComponent
	]
})
export class ClientModule { }
