import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { practicaService } from '../../../services/practica.service';
import { AnyadeGruposPage } from '../anyade-grupos/anyade-grupos';
import { HomeProfesorPage } from '../home-profesor/home-profesor';
import { PracticaDetallePage } from '../practica-detalle/practica-detalle';
import { GrupoDetallePage } from '../grupo-detalle/grupo-detalle';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-ver-grupos',
  templateUrl: 'ver-grupos.html',
  providers: [PracticaDetallePage]
})
export class VerGruposPage {

  recvData = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null, grupo: {} };
  practica = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null, grupo: {} };
  grupos = [];
  alumnos = [];
  posibleFinalizar = true;
  posibleAnyadir = true;
  values = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService, public alertCtrl: AlertController,
    public practicaDetalle: PracticaDetallePage) {

      
    //Si viene de practicaDetalle no puede finalizar la practica, pues ya esta creada
    let anteriorPage = this.navCtrl.last();
    if (anteriorPage.component.name == "PracticaDetallePage") { this.posibleFinalizar = false; }
    else { this.posibleFinalizar = true; }
    


    this.recvData = this.navParams.get('data');
    this.practica.id = this.recvData.id;
    this.practica.asignatura = this.recvData.asignatura;
    this.practica.name = this.recvData.name;
    this.practica.inicio = this.recvData.inicio;
    this.practica.fin = this.recvData.fin;
    this.practica.info = this.recvData.info;
    this.practica.grupo = this.recvData.grupo;

    //si viene de las practicas activas, puede añadir/editar grupos, si viene del historico no
    console.log("RecvData= ", this.recvData)
    const date = moment().format("YYYY-MM-DD");
    if(this.recvData.fin < date) {console.log("he entrado");this.posibleAnyadir = false;}
    else{this.posibleAnyadir = true;}

    practicaService.getGrupos(this.recvData).valueChanges()
      .subscribe(grupos => {
        this.grupos = grupos;
        
        let y=0;
        //console.log(this.grupos);
        //console.log(this.grupos.length);
        for(let n=0; n<this.grupos.length; n++){
          //console.log(this.grupos[n])
          //console.log(this.grupos[n].alumnos.length)
          for(let i=0; i<this.grupos[n].alumnos.length; i++){
            //console.log("iteracion i= "+i)
            //console.log("alumno ="+ this.grupos[n].alumnos[i].name)
            this.alumnos[y] = this.grupos[n].alumnos[i];
            y++;
          }
        }
        //console.log(this.alumnos)

      });
  }

  goToAddGroup() {
    this.navCtrl.push(AnyadeGruposPage, { 'data': this.recvData });
  }

  finalizar() {
    let confirm = this.alertCtrl.create({
      title: 'Crear práctica.',
      message: '¿Estás seguro de que quieres finalizar la creación de la práctica?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Práctica creada con éxito!',
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

  editarGrupo() {

  }

  eliminarGrupo(e) {
    console.log("hago clic "+this.values);
    e.preventDefault();
    /*let confirm = this.alertCtrl.create({
      title: 'Eliminar grupo.',
      message: '¿Estás seguro de que quieres eliminar este grupo?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log('Si clicked');
            //1- coger los alumnos de dicho grupo
            //2- eliminar grupo de la base de datos
            //3- eliminar alumnos de listaAlumnos

            
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
    confirm.present();*/

  }

  grupoPractica = {practicaID: null, practicaFin: null, grupoID: null, keyAlumnos: null, grupoName: null, grupoAlumnos: []}
  verGrupoDetalle(grupo){
    console.log(grupo)
    this.grupoPractica.practicaID = this.practica.id;
    this.grupoPractica.practicaFin = this.practica.fin;
    this.grupoPractica.grupoID = grupo.id;
    this.grupoPractica.grupoName = grupo.name;
    this.grupoPractica.grupoAlumnos = grupo.alumnos;
    this.grupoPractica.keyAlumnos = grupo.keyAlumnos;
    this.navCtrl.push(GrupoDetallePage, {'data': this.grupoPractica})
  }

}
