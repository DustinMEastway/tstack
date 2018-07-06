import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableRoutingModule } from './table-routing.module';
import { TableScreenComponent } from './table-screen/table-screen.component';

@NgModule({
	imports: [
		CommonModule,
		TableRoutingModule
	],
	declarations: [
		TableScreenComponent
	]
})
export class TableModule { }
