import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventTriggerDto } from '../models/event-trigger-dto';
import { ProviderDto } from '../models/provider-dto';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  url = 'http://localhost:8000/providers';

  constructor(private http: HttpClient) {}

  getProviders(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  deleteProvider(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  createProvider(dto: ProviderDto): Observable<any> {
    return this.http.post<any>(this.url, dto);
  }
}
