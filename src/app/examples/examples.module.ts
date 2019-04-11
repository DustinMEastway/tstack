import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

import { ObjectIsBetweenComponent } from './core/object-is-between/object-is-between.component';

export const ExampleComponents = [
	ObjectIsBetweenComponent
];

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		ReactiveFormsModule
	],
	declarations: [
		...ExampleComponents
	],
	entryComponents: [
		...ExampleComponents
	],
	exports: [
		...ExampleComponents
	]
})
export class ExamplesModule { }

export { ObjectIsBetweenComponent };
