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
import { TskNavMenuModule, TskThemeModule } from '@tstack/client';

import { SharedModule } from 'app/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppScreenComponent } from './app-screen.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		SharedModule,
		TskNavMenuModule,
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
