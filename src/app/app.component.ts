import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { ICard } from './iCard';
import { DatePipe } from '@angular/common';
import * as kjvVersion from '../assets/DailyLight.json';
import * as nivVersion from '../assets/DailyLight.NIV.json';

const EVENING_HOUR = 16;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('transition', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms ease-out'),
        style({ opacity: 1 }),
        animate('400ms 150ms ease-in')
      ])
    ])
  ]
})
export class AppComponent {
  title: string = 'Daily Light';
  version: 'KJV' | 'NIV' = 'KJV';
  cards: ICard[] = kjvVersion?.days;
  transitioning: boolean = false;
  cardDate: Date = new Date();
  isMorning: boolean = new Date().getHours() < EVENING_HOUR;
  card: ICard | undefined;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.update();
  }

  update(): void {
    this.transitioning = !this.transitioning;
    const dateString: string | null = this.datePipe.transform(this.cardDate, 'MMMM d');
    this.card = this.cards.find((card: ICard) => card.date == dateString)
    if (this.isMorning) {
      if (!(this.card?.morning && this.card.morning.text.length > 1)) { this.card = undefined; }
    } else {
      if (!(this.card?.evening && this.card.evening.text.length > 1)) { this.card = undefined; }
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

  onChangeVersion(): void {
    this.version = (this.version === 'KJV') ? 'NIV' : 'KJV';
    this.cards = (this.version === 'KJV') ? kjvVersion?.days : nivVersion?.days;
    this.update();
  }
}
