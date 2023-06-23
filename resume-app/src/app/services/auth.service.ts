import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SERVER_BASE_URL: string = "";
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.SERVER_BASE_URL = "http://localhost:5000";
  }

  loginEvent = new EventEmitter<any>();
  sessionUpdateEvent = new EventEmitter<any>();
  jwt: string = '';
  userObj: any = undefined;



  getUserDetails(justLoggedIn: boolean = false) {

    const jwtToken = localStorage.getItem('jwt');
    const headers = {
      Authorization: `Bearer ${jwtToken}`
    };

    let url: string = window.location.href;
    console.log(url)
    console.log(localStorage.getItem('jwt'))
    if ((url.includes('login') || url[url.length - 1] === '/') && !justLoggedIn) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      this.http.get<any>(this.SERVER_BASE_URL + '/me', { headers }).subscribe({
        next: (data) => {
          // console.log(data);
          this.userObj = data;
          this.sessionUpdateEvent.emit();
          resolve();
        }
      });
    });
  }
}
