import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TextPipe } from './text.pipe';

import { CardService } from './card.service';

@NgModule({
  declarations: [
    AppComponent,
    TextPipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [
    CardService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
