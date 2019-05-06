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

    addFriend(user_uid: string, friend_uid: string) {
        this.angularFireDatabase.object('/users/' + user_uid + '/friends/' + friend_uid ).set(friend_uid);
        return this.angularFireDatabase.object('/users/' + friend_uid + '/friends/' + user_uid ).set(user_uid);
    }
}
