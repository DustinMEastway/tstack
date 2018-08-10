import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { TskReadonlyFieldModule } from '@tstack/client';

import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ReadonlyFieldRoutingModule } from './readonly-field-routing.module';
import { ReadonlyFieldScreenComponent } from './readonly-field-screen/readonly-field-screen.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		TskReadonlyFieldModule,
		ReadonlyFieldRoutingModule
	],
	declarations: [
		HomeScreenComponent,
		ReadonlyFieldScreenComponent
	]
})
export class ReadonlyFieldModule { }
