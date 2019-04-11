import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatExpansionModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TskDynamicContentModule } from '@tstack/client';

import { DocumentationComponent } from './documentation/documentation.component';
import { ModuleRoutesComponent } from './module-routes/module-routes.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatButtonModule,
		MatExpansionModule,
		MatTabsModule,
		RouterModule,
		TskDynamicContentModule
	],
	declarations: [
		ModuleRoutesComponent,
		DocumentationComponent
	],
	exports: [
		FlexLayoutModule,
		ModuleRoutesComponent,
		DocumentationComponent
	]
})
export class SharedModule {}
