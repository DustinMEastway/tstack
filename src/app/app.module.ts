import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatIconModule,
	MatTableModule,
	MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TskDynamicContentModule, TskReadonlyFieldModule, TskThemeModule } from '@tstack/client';

import { AppRoutingModule } from './app-routing.module';
import { AppScreenComponent } from './app-screen.component';
import { DocumentationSectionComponent } from './documentation-section/documentation-section.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { LinkComponent } from './link/link.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { ScreenComponent } from './screen/screen.component';
import { TableCellComponent } from './table/table-cell/table-cell.component';
import { TableHeaderCellComponent } from './table/table-header-cell/table-header-cell.component';
import { TableComponent } from './table/table.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatToolbarModule,
		TskDynamicContentModule,
		TskReadonlyFieldModule,
		TskThemeModule,
		AppRoutingModule
	],
	declarations: [
		AppScreenComponent,
		DocumentationComponent,
		DocumentationSectionComponent,
		LinkComponent,
		MarkdownComponent,
		ScreenComponent,
		TableComponent,
		TableCellComponent,
		TableHeaderCellComponent
	],
	entryComponents: [
		LinkComponent,
		MarkdownComponent,
		TableComponent
	],
	bootstrap: [ AppScreenComponent ]
})
export class AppModule { }
