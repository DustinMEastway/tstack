import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { CoreRoutingModule } from './core-routing.module';
import { CoreScreenComponent } from './core-screen.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatToolbarModule,
		CoreRoutingModule
	],
	declarations: [
		CoreScreenComponent,
		ScreenComponent
	]
})
export class CoreModule { }
