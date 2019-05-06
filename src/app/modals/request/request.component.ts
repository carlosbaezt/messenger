import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { RequestService } from 'src/app/services/request.service';
import { Request } from 'src/app/interfaces/request';
import { User } from 'src/app/interfaces/user';

export interface PromptModel {
    scope: any;
    currentRequest: any;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel, OnInit {
    scope: any;
    currentRequest: Request;
    shouldAdd = 'yes';
    public user: User;

  constructor(
      public dialogService: DialogService,
      private userService: UserService,
      private requestService: RequestService
    ) {
        super(dialogService);
    }

    ngOnInit() {
        this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe(
            (user: User) => {
                this.user = user;
            }, (errorUser) => {
                console.log(errorUser);
            }
        );
    }

    accept() {
        status = 'accepted';
        if (this.shouldAdd == 'no') {
            status = 'rejected';
        } else if (this.shouldAdd == 'later') {
            status = 'decide_later';
        }

        this.requestService.setRequestStatus(this.currentRequest, status).then(
            (data) => {
                if (status == 'accepted') {
                    this.userService.addFriend(this.scope.user.uid, this.currentRequest.sender).then(
                        () => {
                            alert('Succesfull');
                        }
                    ).catch(
                        (error) => {
                            console.log(error);
                        }
                    );
                }
                console.log(data);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    }
}
