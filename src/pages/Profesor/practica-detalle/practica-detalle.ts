import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//import del servicios
import { practicaService } from '../../../services/practica.service';
import { profileService } from '../../../services/profile.service';
//firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { practica } from '../../../models/practica.interface';
//import para fechas
import * as moment from 'moment';
//imports de otras paginas
import { ValorarPracticaPage } from '../../Alumno/valorar-practica/valorar-practica';
import { VerGruposPage } from '../ver-grupos/ver-grupos';
import { VerValoracionesPage } from '../ver-valoraciones/ver-valoraciones';
import { HomeProfesorPage } from '../home-profesor/home-profesor';

//@IonicPage()
@Component({
  selector: 'page-practica-detalle',
  templateUrl: 'practica-detalle.html',
})
export class PracticaDetallePage {

  recvData = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null };
  activa = false;
  valorar = false;
  profiles = [];
  profesor = false;
  vengoDeViewPracticas = false;
  sePuedeValorar = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService,
    private afDB: AngularFireDatabase, private afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    profileService: profileService) {

    //comprobar si viene de practicas activas o del historico de practicas
    /*let anteriorPage = this.navCtrl.last();
    if(anteriorPage.component.name == "ViewPracticasPage") {console.log("1");this.vengoDeViewPracticas = true;}
    else{console.log("no ha entrado");this.vengoDeViewPracticas = false;}*/
    

    this.recvData = this.navParams.get('data');
    //comprobar si es profesor
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
            if (this.profesor == true) {
              const date = moment().format("YYYY-MM-DD");
              if (this.recvData.fin >= date) { this.activa = true; }
              //console.log("profesor= " + this.profesor);
            }
            //else= soy alumno
            else {
              const date = moment().format("YYYY-MM-DD");
              if (this.recvData.inicio<=date && this.recvData.fin >= date) { this.valorar = true; }
            }

          }
        )
      });
  }

  editarPractica() {
    const date = moment().format("YYYY-MM-DD");
    if (this.recvData.fin >= date) {
      if(this.recvData.inicio > this.recvData.fin){
        let alert = this.alertCtrl.create({
          title: 'La fecha de fin no puede ser anterior a la de inicio',
          buttons: ['OK']
        });
        alert.present();
      }
      else{
        this.practicaService.editarPractica(this.recvData);
      let alert = this.alertCtrl.create({
        title: 'Editada.',
        subTitle: 'Práctica editada con éxito.',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.pop();
      }
      
    }
  }

  eliminarPractica(){
    let confirm = this.alertCtrl.create({
      title: 'Eliminar práctica.',
      message: '¿Estás seguro de que quieres eliminar esta práctica?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log('Si clicked');
            this.practicaService.eliminarPractica(this.recvData);
            let alert = this.alertCtrl.create({
              title: 'Eliminada.',
              subTitle: 'Práctica eliminada con éxito.',
              buttons: ['OK']
            });
            alert.present();
            this.navCtrl.setRoot(HomeProfesorPage);
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('No eliminar');
          }
        }
      ]
    });
    confirm.present();
  }

  valorarPractica(recvData) {
    console.log(recvData);
    this.navCtrl.push(ValorarPracticaPage, { 'data': recvData });
  }

  verGrupos(){
    this.navCtrl.push(VerGruposPage, {'data': this.recvData});
  }

  verValoraciones(){
    this.navCtrl.push(VerValoracionesPage, {'data': this.recvData})
  }

  isReadonly(){
    if(this.profesor == true){
      //es profesor
      return false;
    }
    else {
      return true;
    }
  }

}
