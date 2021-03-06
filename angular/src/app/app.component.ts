import { Component, OnInit, trigger, animate, transition, style } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from "./card";
import { CardService } from "./card.service";

import 'rxjs/add/operator/catch';

const EVENING_HOUR = 17;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('transition', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate( '300ms ease-out'),
        style({ opacity: 1}),
        animate( '400ms 150ms ease-in')
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title: string = 'Daily Light';
  cards: Card[];
  transitioning: boolean = false;
  cardDate: Date =  new Date();
  isMorning: boolean = new Date().getHours() < EVENING_HOUR;
  card: Card;

  constructor(private cardService: CardService, private datePipe: DatePipe) {
  }

  update(): void {
    this.transitioning = !this.transitioning;
    let dateString: string = this.datePipe.transform(this.cardDate, 'MMMM d');
    this.card = this.cards.find((card: Card) => card.date == dateString)
    if (this.isMorning) {
      if (!(this.card.morning && this.card.morning.text.length > 1)) { this.card = null; }
    } else {
      if (!(this.card.evening && this.card.evening.text.length > 1)) { this.card = null; }
    }
  }

  priorDay(): void {
    this.cardDate = new Date(this.cardDate.getTime() - 86400000);
    this.update();
  }

  nextDay(): void {
    this.cardDate = new Date(this.cardDate.getTime() + 86400000);
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
