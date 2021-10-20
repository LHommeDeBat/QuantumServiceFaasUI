import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventTriggerService {

  url = environment.quantumServiceHost + ':' + environment.quantumServicePort + '/event-triggers';

  constructor(private http: HttpClient) {}

  getEventTriggers(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  createEventTrigger(openWhiskServiceName: string, dto: any): Observable<any> {
    return this.http.post<any>(this.url + "?openWhiskServiceName=" + openWhiskServiceName, dto);
  }

  deleteEventTrigger(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  emitEvent(dto: any): Observable<any> {
    return this.http.post(this.url + '/emit-event', dto);
  }

  unregisterApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName);
  }

  registerApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.post<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName, undefined);
  }
}
