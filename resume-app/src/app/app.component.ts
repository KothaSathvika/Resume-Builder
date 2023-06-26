import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'resume-app';
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService){}

  getUser(){
    return this.auth.userObj.firstname;
  }
}
