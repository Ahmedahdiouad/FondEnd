import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private httpClient : HttpClient) { }

  getAllMaintenance() : Observable<any>{
    return this.httpClient.get(`${baseURL}maintenance/getAll/`);
  }

  getMachines() : Observable<any>{
    return this.httpClient.get(`${baseURL}maintenance/getMachines/`);
  }

  getMaintenanceType() : Observable<any>{
    return this.httpClient.get(`${baseURL}maintenance/getMaintenanceType/`);
  }

  addMaintenance(data : any) : Observable<any>{
    return this.httpClient.post(`${baseURL}maintenance/AddMaintenance/`,data);
  }

  deleteMaintenance(id : any) : Observable<any>{
    return this.httpClient.delete(`${baseURL}maintenance/deleteMaintenance/${id}/`)
  }
}
