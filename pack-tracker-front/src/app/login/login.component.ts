import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  validateForm!: FormGroup;
  isFormSubmitted = false;
  errorVisible = false

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  login() {
    this.isFormSubmitted = true

    if (this.validateForm.valid) {
      let email = this.validateForm.value.email;
      let password = this.validateForm.value.password

      this.userService.login(email, password).subscribe(
        (response) => {
          this.userService.saveToken(response.token)
          this.userService.sendUpdate(true)
          this.router.navigateByUrl("/")
        },
        (error) => {
          this.showErrors()
        }
      )

    } else {
      this.showErrors()
    }

  }


  showErrors() {
    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    this.errorVisible = true;
    setTimeout(() => {
      this.errorVisible = false;
    }, 3000);

    this.validateForm.reset()
  }

}
