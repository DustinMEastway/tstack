import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { TskReadonlyFieldModule } from '@tstack/client';

import { ReadonlyFieldAppearanceComponent } from './client/readonly-field-appearance/readonly-field-appearance.component';
import { HasDuplicatesObjectsComponent } from './core/has-duplicates-objects/has-duplicates-objects.component';
import { HasDuplicatesPrimativesComponent } from './core/has-duplicates-primatives/has-duplicates-primatives.component';
import { ObjectIsBetweenComponent } from './core/object-is-between/object-is-between.component';

export const exampleComponents = [
	HasDuplicatesObjectsComponent,
	HasDuplicatesPrimativesComponent,
	ObjectIsBetweenComponent,
	ReadonlyFieldAppearanceComponent
];

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		ReactiveFormsModule,
		TskReadonlyFieldModule
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
	ObjectIsBetweenComponent
};
