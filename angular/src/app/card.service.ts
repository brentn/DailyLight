import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Card } from "./card";

@Injectable()
export class CardService {
  private _dataURL = 'assets/DailyLight.json';

  constructor(private http: Http) {  }

  loadCards(): Observable<Card[]> {
    return this.http.get(this._dataURL)
      .map((res: Response) => <Card[]> res.json().days.day)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error('Error:',error);
    return Observable.throw(error.json().error ||  'Server error');
  }
}
