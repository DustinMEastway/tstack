import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TskAutocompleteModule, TskThemeModule } from '@tstack/client';

import { AppRoutingModule } from './app-routing.module';
import { AppScreenComponent } from './app-screen.component';
import { DocNotFoundComponent } from './doc-not-found/doc-not-found.component';
import { DocumentationModule } from './documentation/documentation.module';
import { ExamplesModule } from './examples/examples.module';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		DocumentationModule,
		ExamplesModule,
		HttpClientModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		ReactiveFormsModule,
		TskAutocompleteModule,
		TskThemeModule,
		AppRoutingModule
	],
	declarations: [
		AppScreenComponent,
		DocNotFoundComponent,
		ScreenComponent
	],
	bootstrap: [ AppScreenComponent ]
})
export class AppModule { }
