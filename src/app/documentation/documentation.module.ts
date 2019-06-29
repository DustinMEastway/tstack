import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TskDynamicContentModule, TskReadonlyFieldModule } from '@tstack/client';

import { DocumentationSectionComponent } from './documentation-section/documentation-section.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { LinkComponent } from './link/link.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { TableCellComponent } from './table/table-cell/table-cell.component';
import { TableHeaderCellComponent } from './table/table-header-cell/table-header-cell.component';
import { TableComponent } from './table/table.component';

const dynamicComponents = [
	LinkComponent,
	MarkdownComponent,
	TableComponent
];

@NgModule({
	imports: [
		CommonModule,
		MatTableModule,
		RouterModule,
		TskDynamicContentModule,
		TskReadonlyFieldModule
	],
	declarations: [
		...dynamicComponents,
		DocumentationComponent,
		DocumentationSectionComponent,
		TableCellComponent,
		TableHeaderCellComponent
	],
	entryComponents: [
		...dynamicComponents
	],
	exports: [
		...dynamicComponents,
		DocumentationComponent,
		DocumentationSectionComponent
	]
})
export class DocumentationModule {}
