import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { usersService } from '../../services/users.service';
//firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { EmailAuthProvider } from '@firebase/auth-types';
import { AngularFireAuth } from 'angularfire2/auth';
//imports de otras paginas
import { SigninPage } from '../signin/signin';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = { email: null, pass: null };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public usersService: usersService, public afDB: AngularFireDatabase) {
  }

  signUp() {
    this.usersService.createUser(this.user)
      .then((Response) => {
        if (Response) {
          this.navCtrl.setRoot(ProfilePage);
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Registro incorrecto!',
            subTitle: 'Algo no fue como esperabamos. Vuelve a intentarlo.',
            buttons: ['OK']
          });
          alert.present();
        }
      }).catch((error) => {
        console.log(error);
        if (error.code == 'auth/invalid-email') {
          let alert = this.alertCtrl.create({
            title: 'Registro incorrecto!',
            subTitle: 'E-mail invalido.',
            buttons: ['OK']
          });
          alert.present();
        }
        else if (error.code == 'auth/weak-password') {
          let alert = this.alertCtrl.create({
            title: 'Registro incorrecto!',
            subTitle: 'Contraseña débil.',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Registro incorrecto!',
            subTitle: 'Algo no fue como esperabamos.',
            buttons: ['OK']
          });
          alert.present();
        }
      });
  }

  //Metodo para pulsar enter y que se "pulse" el botón de sign in
  enterButton() {
    this.signUp();
  }

}
