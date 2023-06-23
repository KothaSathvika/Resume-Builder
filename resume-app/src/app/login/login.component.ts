import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../confirm-password.validator';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private fb: FormBuilder,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
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
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
    else {
      if (this.loginMode == true) {
        this.login();
        console.log("Login")
      } else {
        this.register();
      }
    }
  }

  // login(){
  //   this.auth.send_login_request(this.loginForm.value, this.auth.SERVER_BASE_URL + '/api/v1/login').subscribe();
  //   this.router.navigate(['/home']);
  // }
  // ngOnInit(): void {
  //   // this.utilityService.breadCrumbsData.emit([]);
  //   if (localStorage.getItem('jwt')) {
  //     this.auth.getUserDetails(true);
  //     // this.utilityService.loginEvent.emit();
  //     this.router.navigate(['/courses']);
  //   }
  // }

  login() {
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;
    this.http.post<any>(this.auth.SERVER_BASE_URL + '/login', {
      'email': this.email,
      'password': this.password
    }).subscribe({
      next: async (data) => {
        localStorage.setItem("jwt", data.access_token);
        // console.log(data.access_token)
        // const jwtToken = localStorage.getItem('jwt');
        // console.log(jwtToken)
        await this.auth.getUserDetails(true);
        console.log("data in component.ts", this.auth.userObj)
        console.log(this.auth.userObj);
        // this.utilityService.loginEvent.emit();
        this.router.navigate(['/home']);
      }
    });
  }

  register() {
    this.firstname = this.loginForm.get('firstname')?.value;
    this.lastname = this.loginForm.get('lastname')?.value;
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;
    this.password1 = this.loginForm.get('password1')?.value;
    this.http.post<any>(this.auth.SERVER_BASE_URL + '/register', {
      'firstname': this.firstname,
      'lastname': this.lastname,
      'email': this.email,
      'password': this.password,
      'password1': this.password1
    }).subscribe({
      next: async (data) => {
        // this.router.navigate(['/login']);
        this.login();
      }

    });
  }

  // register(){
  //   this.auth.send_post_request(this.loginForm.value, this.auth.SERVER_BASE_URL + '/api/v1/register').subscribe();
  //   this.loginForm.reset()

  //   this.loginMode = true;    
  //   this.router.navigate(['/login']);
  //   window.location.reload()

  // }
}
