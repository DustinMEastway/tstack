import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableScreenComponent } from './table-screen/table-screen.component';

const routes: Routes = [
	{
		path: '',
		component: TableScreenComponent,
		children: []
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class TableRoutingModule { }
