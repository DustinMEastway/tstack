import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

import { ArrayHasDuplicatesComponent } from './core/array-has-duplicates/array-has-duplicates.component';
import { ObjectIsBetweenComponent } from './core/object-is-between/object-is-between.component';

export const exampleComponents = [
	ArrayHasDuplicatesComponent,
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
		...exampleComponents
	],
	entryComponents: [
		...exampleComponents
	],
	exports: [
		...exampleComponents
	]
})
export class ExamplesModule { }

export {
	ArrayHasDuplicatesComponent,
	ObjectIsBetweenComponent
};
