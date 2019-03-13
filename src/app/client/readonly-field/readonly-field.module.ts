import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { TskReadonlyFieldModule } from '@tstack/client';

import { ReadonlyFieldRoutingModule } from './readonly-field-routing.module';
import { ReadonlyFieldScreenComponent } from './readonly-field-screen.component';
import { ScreenComponent } from './screen/screen.component';

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
		ScreenComponent,
		ReadonlyFieldScreenComponent
	]
})
export class ReadonlyFieldModule { }
