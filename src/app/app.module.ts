import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './input.component';
import { UserComponent } from './user.component';
import { TskValidationMessagePipe } from './tstack-validation';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    UserComponent,
    TskValidationMessagePipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
