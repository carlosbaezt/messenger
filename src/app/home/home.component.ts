import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../services/request.service';
import { Request } from '../interfaces/request';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    friends: User[];
    query: string;
    public user: User;
    friendEmail = '';

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private modalService: NgbModal,
        private requestService: RequestService
    ) {
        this.userService.getUsers().valueChanges().subscribe(
            (users: User[]) => {
                console.log(users);
                this.friends = users;
            },
            (error) => {
                console.log(error);
            }
        );

        this.authenticationService.getStatus().subscribe(
            (data) => {
                this.userService.getUserById(data.uid).valueChanges().subscribe(
                    (user: User) => {
                        this.user = user;
                    }, (errorUser) => {
                        console.log(errorUser);
                    }
                );
            }, (error) =>{
                console.log(error);
            }
        );
    }

    ngOnInit() { }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['login']);
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { }, (reason) => { });
    }

    sendRequest() {
        const request: Request = {
            timestamp: Date.now(),
            receiver_email: this.friendEmail,
            sender: this.user.uid,
            status: 'pending'
        };
        this.requestService.createRequest(request).then(
            (data) => {
                alert('Request send succesful');
                this.friendEmail = '';
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    }
}