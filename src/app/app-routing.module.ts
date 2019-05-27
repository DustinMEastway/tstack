import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreenComponent } from './screen/screen.component';

const routes: Routes = [
	{
		path: '**',
		component: ScreenComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
