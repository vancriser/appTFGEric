import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { Observable } from '@firebase/util';
import * as firebase from 'firebase/app';

@Injectable()
export class profileService {
    constructor(public afDB: AngularFireDatabase) { }

    profiles = [];

    //devuelve todos los perfiles existentes
    public getProfiles() {
        return this.afDB.list('profiles/');
    }
}