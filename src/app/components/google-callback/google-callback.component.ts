import { AuthService } from 'src/app/services/auth';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from 'src/app/models/user';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  styleUrls: ['./google-callback.component.scss'],
})
export class GoogleCallbackComponent implements OnInit {
  hasError: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private socketIOService: SocketIOService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socialLogin();
  }

  socialLogin() {
    this.hasError = false;
    const queryParams = this.route.snapshot.queryParams;
    this.authService
      .socialLogin(queryParams)
      .pipe(first())
      .subscribe((user: UserType | undefined) => {
        if (user) {
          this.socketIOService.login(user);
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
        }
      });
  }
}
