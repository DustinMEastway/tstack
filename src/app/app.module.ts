import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatToolbarModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent,
		HomeScreenComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
