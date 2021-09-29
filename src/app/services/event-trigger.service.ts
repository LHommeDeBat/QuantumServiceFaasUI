import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventTriggerDto } from '../models/event-trigger-dto';

@Injectable({
  providedIn: 'root'
})
export class EventTriggerService {

  url = 'http://localhost:9005/event-triggers';

  constructor(private http: HttpClient) {}

  getEventTriggers(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  createEventTrigger(dto: EventTriggerDto): Observable<any> {
    return this.http.post<any>(this.url, dto);
  }

  deleteEventTrigger(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  fireEvent(dto: any): Observable<any> {
    return this.http.post(this.url + '/fire-event', dto);
  }

  unregisterApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName);
  }

  registerApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.post<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName, undefined);
  }
}
