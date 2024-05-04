import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // injection de dependance :
  constructor(private httpClient : HttpClient) { }

  login(data : any) : Observable<any>{
    return this.httpClient.post(`${baseURL}accounts/api/auth/`,data);
  }

  logout() {
    localStorage.removeItem("currentUser");
  }

  // post, get, put, delete
}
