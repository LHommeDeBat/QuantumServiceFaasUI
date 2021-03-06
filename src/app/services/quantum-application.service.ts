import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuantumApplicationService {

  url = environment.quantumServiceHost + ':' + environment.quantumServicePort + '/quantum-applications';

  constructor(private http: HttpClient) {}

  getQuantumApplications(noResultEventOnly?: boolean): Observable<any> {
    // Setup log namespace query parameter
    let params = new HttpParams();
    if (noResultEventOnly) {
      params = params.append('noResultEventOnly', noResultEventOnly);
    }

    return this.http.get<any>(this.url, { params: params });
  }

  getApplicationEventTriggers(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  createQuantumApplication(name: string, openWhiskServiceName: string, dockerImage: string, notificationAddress: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('openWhiskServiceName', openWhiskServiceName);
    if (dockerImage) {
      formData.append('dockerImage', dockerImage);
    }
    if (notificationAddress) {
      formData.append('notificationAddress', notificationAddress);
    }

    return this.http.post<any>(this.url, formData);
  }

  deleteQuantumApplication(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  invokeApplication(url: string, dto: any) {
    return this.http.post<any>(url, dto);
  }
}
