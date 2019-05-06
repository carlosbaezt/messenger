import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Request } from '../interfaces/request';


@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private angularFireDatabase: AngularFireDatabase) { }

    createRequest(request: Request) {
        const cleanEmail = this.cleanEmail(request.receiver_email);
        return this.angularFireDatabase.object('requests/' + cleanEmail + '/' + request.sender).set(request);
    }

    setRequestStatus(request: Request, status: string) {
        const cleanEmail = this.cleanEmail(request.receiver_email);
        return this.angularFireDatabase.object('requests/' + cleanEmail + '/' + request.sender + '/status').set(status);
    }

    getRequestForEmail(email) {
        const cleanEmail = this.cleanEmail(email);
        return this.angularFireDatabase.list('requests/' + cleanEmail);
    }

    private cleanEmail(email) {
        return email.replace(/\./g, ',');
    }
}