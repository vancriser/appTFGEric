import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
//modelos
import { Profile } from '../../models/profile';
//paginas
import { SigninPage } from '../signin/signin';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth, private afDB: AngularFireDatabase, public alertCtrl: AlertController) {
  }

  enterButton() {
    this.createProfile();
  }

  createProfile() {
    this.afAuth.authState.take(1).subscribe(
      auth => {
        this.profile.id = auth.uid;
        this.afDB.object(`profiles/${auth.uid}`).set(this.profile)
          .then(() => {
            let alert = this.alertCtrl.create({
              title: 'Registro completado',
              subTitle: 'Gracias por registrarte!',
              buttons: ['OK']
            });
            alert.present();
            this.navCtrl.setRoot(SigninPage)
          })
      }

    )
  }

}
