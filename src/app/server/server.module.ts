import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { ServerRoutingModule } from './server-routing.module';
import { ServerScreenComponent } from './server-screen/server-screen.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatToolbarModule,
		ServerRoutingModule
	],
	declarations: [
		ServerScreenComponent
	]
})
export class ServerModule { }
