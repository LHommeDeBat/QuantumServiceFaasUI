import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventTriggerDto } from '../models/event-trigger-dto';
import { OpenWhiskServiceDto } from '../models/open-whisk-service-dto';

@Injectable({
  providedIn: 'root'
})
export class OpenWhiskServiceService {

  url = 'http://localhost:8000/openwhisk-services';

  constructor(private http: HttpClient) {}

  getOpenWhiskServices(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getOpenWhiskService(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  deleteOpenWhiskService(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  createOpenWhiskService(dto: OpenWhiskServiceDto): Observable<any> {
    return this.http.post<any>(this.url, dto);
  }
}
