import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ICard } from './iCard';
import { DatePipe } from '@angular/common';
import * as kjvVersion from '../assets/DailyLight.json';
import * as nivVersion from '../assets/DailyLight.NIV.json';

const EVENING_HOUR = 16;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  title: string = 'Daily Light';
  version: 'KJV' | 'NIV' = 'KJV';
  cards: ICard[] = kjvVersion?.days;
  transition: 'left' | 'right' | undefined;
  cardDate: Date = new Date();
  isMorning: boolean = new Date().getHours() < EVENING_HOUR;
  card: ICard | undefined;

  constructor(private datePipe: DatePipe, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.update();
  }

  update(): void {
    const dateString: string | null = this.datePipe.transform(this.cardDate, 'MMMM d');
    this.card = this.cards.find((card: ICard) => card.date == dateString)
    if (this.isMorning) {
      if (!(this.card?.morning && this.card.morning.text.length > 1)) { this.card = undefined; }
    } else {
      if (!(this.card?.evening && this.card.evening.text.length > 1)) { this.card = undefined; }
    }
    setTimeout(() => {
      this.transition = undefined;
      this.cd.detectChanges();
    }, 300);
  }

  priorDay(): void {
    this.transition = 'right';
    this.cd.detectChanges();
    this.cardDate = new Date(this.cardDate.getTime() - 86400000);
    this.update();
  }

  nextDay(): void {
    this.transition = 'left';
    this.cd.detectChanges();
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

  isTouchDevice(): boolean {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0));
  }


  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord![0], coord[1] - this.swipeCoord![1]];
      const duration = time - this.swipeTime!;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        if (swipe === 'next') {
          this.nextDay();
        } else {
          this.priorDay();
        }
      }
    }
  }
}
