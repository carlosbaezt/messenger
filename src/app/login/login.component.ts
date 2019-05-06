import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public operation: String = 'login';
    public email: string = null;
    public password: string = null;
    public nick: string = null;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    login() {
        this.authenticationService.loginWithEmail(this.email, this.password).then(
            (data) => {
                alert('Login Successful');
                console.log(data);
                this.router.navigate(['home']);
            }).catch( (error) => {
                alert('Login Failed');
                console.log(error);
            });
    }

    register() {
        this.authenticationService.registerWithEmail(this.email, this.password).then(
            (data) => {
                console.log(data);
                const user: User = {
                    uid: data.user.uid,
                    nick: this.nick,
                    email: this.email
                };
                this.userService.createUser(user).then((dataUserService) => {
                    alert('Register Successful');
                    console.log(dataUserService);
                    this.router.navigate(['home']);
                }).catch( (error) => {
                    alert('Create User Failed');
                    console.log(error);
                });
            }).catch( (error) => {
                alert('Register Failed');
                console.log(error);
            });
    }
}
