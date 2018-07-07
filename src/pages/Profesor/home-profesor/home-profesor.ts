import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
//firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
//Imports de otras paginas
import { CreatePracticaPage } from '../create-practica/create-practica';
import { ViewPracticasPage } from '../view-practicas/view-practicas';
import { OldPracticasPage } from '../old-practicas/old-practicas';
//modelos
import { Profile } from '../../../models/profile';
//servicios
import { profileService } from '../../../services/profile.service';

@IonicPage()
@Component({
  selector: 'page-home-profesor',
  templateUrl: 'home-profesor.html',
})
export class HomeProfesorPage {

  profileData: AngularFireObject<Profile>
  profiles = [];
  profesor = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth, private toast: ToastController,
    private afDB: AngularFireDatabase, public profileService: profileService) {

    profileService.getProfiles().valueChanges()
      .subscribe(profiles => {
        this.profiles = profiles;
        this.afAuth.authState.subscribe(
          auth => {
            this.profiles = this.profiles.filter((profile) => {
              return profile.id == auth.uid;
            }
            )
          }
        )
        this.afAuth.authState.subscribe(
          auth => {
            if (this.profiles[0].rol == "profesor") this.profesor = true;
          }
        )
      });
  }

  /*
  * Este método le dice a la app que ya estas verificado siempre y cuando
  * haya datos y haya encontrado el uid, además, saluda.
  */
  ionViewWillLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Welcome, ${data.email}`,
          duration: 3000
        }).present();
        this.profileData = this.afDB.object<Profile>(`profiles/${data.uid}`)
        console.log(this.profileData);
      }
      else {
        this.toast.create({
          message: `Could not find authentication details`,
          duration: 3000
        }).present();
      }
    });
  }

  //métodos para ir a otras ventanas
  //Ir a crear práctica
  goToCreatePractica() {
    this.navCtrl.push(CreatePracticaPage);
  }
  //Ir a ver las practicas activas
  goToViewPracticas() {
    this.navCtrl.push(ViewPracticasPage, {'data': this.profesor});
  }
  //Ir a ver las prácticas ya terminadas
  goToOldPracticas() {
    this.navCtrl.push(OldPracticasPage, {'data': this.profesor});
  }
}
