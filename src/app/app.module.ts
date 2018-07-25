import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TskThemeModule } from '@tstack/client';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatSelectModule,
		MatToolbarModule,
		TskThemeModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		HomeScreenComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
