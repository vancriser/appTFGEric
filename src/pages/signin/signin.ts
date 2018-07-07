import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//import servicio usuarios
import { usersService } from '../../services/users.service';
//firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { EmailAuthProvider } from '@firebase/auth-types';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
//imports de otras paginas
import { SignupPage } from '../signup/signup';
import { HomeProfesorPage } from '../Profesor/home-profesor/home-profesor';
import { ProfilePage } from '../profile/profile';
import { assertionError } from '@firebase/util';
import { ParseError } from '@angular/compiler';
import { profileService } from '../../services/profile.service';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  user = { email: null, pass: null };
  profiles = [];
  profesor = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public usersService: usersService, public afDB: AngularFireDatabase, public profileService: profileService,
    private afAuth: AngularFireAuth) {
  }

  //sign in
  //en navCtrl.setRoot no se pone push, porque te deja volver atrás, con setRoot no
  signIn() {
    try {
      this.usersService.login(this.user)
        .then((Response) => {
          if (Response) {
            this.navCtrl.setRoot(HomeProfesorPage);
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Usuario incorrecto!',
              subTitle: 'Comprueba las credenciales o crea un nuevo usuario.',
              buttons: ['OK']
            });
            alert.present();
          }
        }).catch((error) => {
          let alert = this.alertCtrl.create({
            title: 'Usuario incorrecto!',
            subTitle: 'Comprueba las credenciales o crea un nuevo usuario.',
            buttons: ['OK']
          });
          alert.present();
        });
    }
    //tratamiento del error de hacer signIn sin rellenar los campos
    catch (e) {
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Rellena los campos correctamente, por favor.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  //Metodo para pulsar enter y que se "pulse" el botón de sign in
  enterButton() {
    this.signIn();
  }

  //acceso a la pagina de registro
  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

}
