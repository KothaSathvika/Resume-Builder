import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginMode: boolean = true;
  firstname: string="";
  lastname: string="";
  email: string = "";
  password:string="";
  password1:string=""

  loginForm: FormGroup = this.fb.group({
    firstname: new FormControl(this.firstname, [
      Validators.required
    ]),
    lastname: new FormControl(this.lastname, [
      Validators.required
    ]),
    password: new FormControl(this.password, [
      Validators.required
    ]),
    password1: new FormControl(this.password1, [
      Validators.required
    ]),
    email: new FormControl(this.email, [
      Validators.required
    ])
  })

  constructor(
    private fb: FormBuilder
  ){}

  changeMode() {
    this.loginMode = !this.loginMode;
    if (!this.loginMode) {
      this.loginForm = this.fb.group({
        firstname: new FormControl(this.firstname, [
          Validators.required
        ]),
        lastname: new FormControl(this.lastname, [
          Validators.required
        ]),
        email: new FormControl(this.email, [
          Validators.required]),
        password: new FormControl(this.password, [
          Validators.required,
        ]),
        password1: new FormControl(this.password1, [
          Validators.required,
        ]),
      },);
    } else {
      this.loginForm = this.fb.group({
        email: new FormControl(this.email, [
          Validators.required]),
        password: new FormControl(this.password, [
          Validators.required,
          Validators.minLength(6)]),
      });
    }
  }


}
