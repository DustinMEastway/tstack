import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		MatButtonModule,
		MatToolbarModule,
		AppRoutingModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
