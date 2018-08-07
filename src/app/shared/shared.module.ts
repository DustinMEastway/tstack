import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ModuleRoutesComponent } from './module-routes/module-routes.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatButtonModule,
		RouterModule
	],
	declarations: [
		ModuleRoutesComponent
	],
	exports: [
		FlexLayoutModule,
		ModuleRoutesComponent
	]
})
export class SharedModule {}
