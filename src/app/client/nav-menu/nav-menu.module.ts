import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';

import { NavMenuRoutingModule } from './nav-menu-routing.module';
import { NavMenuScreenComponent } from './nav-menu-screen/nav-menu-screen.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatToolbarModule,
		NavMenuRoutingModule
	],
	declarations: [
		NavMenuScreenComponent,
	]
})
export class NavMenuModule { }
