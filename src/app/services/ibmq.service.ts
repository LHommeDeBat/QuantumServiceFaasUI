import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IbmqService {

  url = 'http://localhost:9005/ibmq';

  constructor(private http: HttpClient) {}

  getAvailableDevices(): Observable<any> {
    return this.http.get<any>(this.url + '/devices');
  }
}
