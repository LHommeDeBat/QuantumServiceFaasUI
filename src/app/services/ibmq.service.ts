import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IbmqService {
  
  url = environment.quantumServiceHost + ':' + environment.quantumServicePort + '/ibmq';

  constructor(private http: HttpClient) {}

  getAvailableDevices(): Observable<any> {
    return this.http.get<any>(this.url + '/devices');
  }
}
