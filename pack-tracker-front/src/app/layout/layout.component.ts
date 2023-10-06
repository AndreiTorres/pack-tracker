import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  private subscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
    this.subscription = this.userService.getUpdate().subscribe(message => {
      this.isLoggedIn = message
    })
   }

  ngOnInit(): void {
    if (this.userService.getToken()) {
      this.isLoggedIn = true
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    this.userService.logout()
    this.isLoggedIn = false
    this.router.navigateByUrl("/login")
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
