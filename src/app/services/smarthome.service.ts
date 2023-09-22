import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmarthomeService { 

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
    console.log(this.baseUrl);
  }

  createThing(data: any) {
    return this.http.post<any>(`${this.baseUrl}/devices/creatething`, data);
  }
  
  getAllDevices() {
    return this.http.get<any>(`${this.baseUrl}/devices/getthings`);
  }

  publishDevice(deviceId:any, data:any) {
    return this.http.post<any>(`${this.baseUrl}/devices/pubsubthing/${deviceId}`, data);
  }
}
