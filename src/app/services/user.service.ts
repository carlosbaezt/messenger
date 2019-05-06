import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private angularFireDatabase: AngularFireDatabase) { }

    getUsers() {
        return this.angularFireDatabase.list('/users');
    }

    getUserById(uid) {
        return this.angularFireDatabase.object('/users/' + uid);
    }

    createUser(user: User) {
        return this.angularFireDatabase.object('/users/' + user.uid).set(user);
    }

    updateUser(user: User) {
        return this.angularFireDatabase.object('/users/' + user.uid).update(user);
    }

    setAvatar(avatar, uid: string) {
        return this.angularFireDatabase.object('/users/' + uid + '/avatar' ).set(avatar);
    }
}