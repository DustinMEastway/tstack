import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	MatButtonModule,
	MatIconModule,
	MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TskThemeModule } from '@tstack/client';

import { AppRoutingModule } from './app-routing.module';
import { AppScreenComponent } from './app-screen.component';
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
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		TskThemeModule,
		AppRoutingModule
	],
	declarations: [
		AppScreenComponent,
		ScreenComponent
	],
	bootstrap: [ AppScreenComponent ]
})
export class AppModule { }
