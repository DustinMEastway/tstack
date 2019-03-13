import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatExpansionModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ModuleRoutesComponent } from './module-routes/module-routes.component';
import { PropertyDescriptionsComponent } from './property-descriptions/property-descriptions.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatButtonModule,
		MatExpansionModule,
		RouterModule
	],
	declarations: [
		ModuleRoutesComponent,
		PropertyDescriptionsComponent
	],
	exports: [
		FlexLayoutModule,
		ModuleRoutesComponent,
		PropertyDescriptionsComponent
	]
})
export class SharedModule {}
