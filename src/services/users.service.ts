import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Observable } from '@firebase/util';
import * as firebase from 'firebase/app';
import { SignupPage } from '../pages/signup/signup';

@Injectable()
export class usersService {
    constructor(public afDB: AngularFireDatabase, public afAuth: AngularFireAuth) { }

    usersList = [];

    public login(user) {
        return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.pass);
    }

    public createUser(user) {
        return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.pass);
    }

    public getUserUid() {
        return this.afAuth.authState;
    }

}