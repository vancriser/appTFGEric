import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//imports angular
import { AngularFireAuth } from 'angularfire2/auth';
//imports servicios
import { practicaService } from '../../../services/practica.service';
import { profileService } from '../../../services/profile.service';
//otras paginas
import { AnyadeGruposPage } from '../anyade-grupos/anyade-grupos';
import { VerGruposPage } from '../ver-grupos/ver-grupos';

@IonicPage()
@Component({
  selector: 'page-create-practica',
  templateUrl: 'create-practica.html',
})
export class CreatePracticaPage {

  practica = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null, creadorID: null };
  profiles = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService, public alertCtrl: AlertController,
    private afAuth: AngularFireAuth, public profileService: profileService) {
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
            if (this.profiles[0].id != null) this.practica.creadorID = this.profiles[0].id;
          }
        )
      });
  }

  /**/



  createPractica() {
    if (this.practica.asignatura == null || this.practica.name == null || this.practica.inicio == null ||
      this.practica.fin == null || this.practica.info == null) {
      let alert = this.alertCtrl.create({
        title: 'Rellena todos los campos.',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      try {
        this.practica.id = Date.now();
        if (this.practica.inicio > this.practica.fin) {
          let alert = this.alertCtrl.create({
            title: 'La fecha de fin no puede ser anterior a la de inicio',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          this.practicaService.createPractica(this.practica);
          /**/
          this.navCtrl.setRoot(AnyadeGruposPage, { 'data': this.practica });
        }
      }
      catch{ }
    }
  }
}
