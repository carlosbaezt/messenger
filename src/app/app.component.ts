import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { RequestService } from './services/request.service';
import { User } from './interfaces/user';
import { Request } from './interfaces/request';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'messenger';
  public user: User;
  public requests: Request[] = [];
  public mailsShown: any[] = [];

  constructor(
      public router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private requestService: RequestService,
      private dialogService: DialogService
    ) {
        this.authenticationService.getStatus().subscribe(
            (data) => {
                if (data != null) {
                    this.userService.getUserById(data.uid).valueChanges().subscribe(
                        (user: User) => {
                            this.user = user;
                            this.requestService.getRequestForEmail(user.email).valueChanges().subscribe(
                                (dataRequest: Request[]) => {
                                    this.requests = dataRequest.filter((request) => {
                                        return request.status !== 'accepted' && request.status !== 'rejected';
                                    }) ;
                                    this.requests.forEach( (request) => {
                                        if (this.mailsShown.indexOf(request.sender) === -1) {
                                            this.mailsShown.push(request.sender);
                                            this.dialogService.addDialog(RequestComponent, { scope: this, currentRequest: request } );
                                        }
                                    });
                                }, (error) => {
                                    console.log(error);
                                }
                            );
                        }, (errorUser) => {
                            console.log(errorUser);
                        }
                    );
                }
            }, (error) => {
                console.log(error);
            }
        );

  }
}
