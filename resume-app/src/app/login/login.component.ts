import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../confirm-password.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginMode: boolean = true;
  firstname: string = "";
  lastname: string = "";
  email: string = "";
  password: string = "";
  password1: string = ""
  isPasswordHidden: boolean = true;
  passwordType: string = 'password';
  submitted: boolean = false;

  loginForm: FormGroup = this.fb.group({

    password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(6),
    ]),

    email: new FormControl(this.email, [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')

    ])
  })

  constructor(
    private fb: FormBuilder
  ) { }

  changeMode() {
    this.loginMode = !this.loginMode;
    console.log(this.loginMode)
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
          Validators.minLength(6),
        ]),
        password1: new FormControl(this.password1, [
          Validators.required,
        ]),

      },
        {
          validator: ConfirmPasswordValidator("password", "password1")
        }
      );
    } else {
      this.loginForm = this.fb.group({
        email: new FormControl(this.email, [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]),
        password: new FormControl(this.password, [
          Validators.required,
          Validators.minLength(6)]),
      });
    }
  }
  togglePasswordVisibility() {
    this.isPasswordHidden = !this.isPasswordHidden;
    if (!this.isPasswordHidden) {
      console.log("Password is shown")
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  get f() { return this.loginForm.controls; }

  process() {
    this.submitted = true;
    this.password = this.loginForm.get('password')?.value;
    console.log(this.password)
    if (this.loginForm.invalid) {
      console.log("form is invalid")
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
  }
}
