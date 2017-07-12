import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Card } from "./card";
import { CardService } from "./card.service";

import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'Daily Light';
  cards: Card[] = [];
  date: Date;
  isMorning: boolean = true;
  card: Card;

  constructor(private cardService: CardService, private datePipe: DatePipe) {
    this.date = new Date();
    this.isMorning = new Date().getHours() < 17;
  }

  update(): void {
    let dateString: string = this.datePipe.transform(this.date, 'MMMM d');
    this.card = this.cards.find((card: Card) => card.date == dateString)
    if (this.isMorning) {
      if (!(this.card.morning && this.card.morning.text.length > 1)) { this.card = null; }
    } else {
      if (!(this.card.evening && this.card.evening.text.length > 1)) { this.card = null; }
    }
  }

  priorDay(): void {
    this.date.setDate(this.date.getDate() - 1);
    this.update();
  }

  nextDay(): void {
    this.date.setDate(this.date.getDate() + 1);
    this.update();
  }

  toggleMorning(): void {
    this.isMorning = !this.isMorning;
    this.update();
  }

  ngOnInit() {
    this.cardService.loadCards()
      .subscribe((cards: Card[]) => {
        this.cards = cards;
        this.update();
      })
  }

}
