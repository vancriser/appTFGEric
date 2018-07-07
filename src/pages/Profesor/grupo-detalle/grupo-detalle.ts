import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { practicaService } from '../../../services/practica.service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-grupo-detalle',
  templateUrl: 'grupo-detalle.html',
})
export class GrupoDetallePage {

  grupo = {practicaID: null, practicaFin: null, id: null, keyAlumnos: null, name: null, alumnos: []};
  recvData = {practicaID: null, practicaFin: null, grupoID: null, keyAlumnos: null, grupoName: null, grupoAlumnos: []};
  alumnos = [];
  posibleEliminar = false;
  valoraciones = [];
  valoracionBorrada= {practicaID:null, key: null};


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public practicaService: practicaService) {
      
      this.recvData = this.navParams.get('data');
      this.grupo.practicaID = this.recvData.practicaID;
      this.grupo.practicaFin = this.recvData.practicaFin;
      this.grupo.id = this.recvData.grupoID;
      this.grupo.name = this.recvData.grupoName;
      this.grupo.alumnos = this.recvData.grupoAlumnos;
      this.grupo.keyAlumnos = this.recvData.keyAlumnos;
    
      const date = moment().format("YYYY-MM-DD");
      if(this.grupo.practicaFin < date) {this.posibleEliminar = false;}
      else {this.posibleEliminar = true;}

    console.log(this.recvData.grupoID)
  }

  eliminarGrupo(){
    let confirm = this.alertCtrl.create({
      title: 'Eliminar grupo.',
      message: '¿Estás seguro de que quieres eliminar este grupo?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log('Si clicked');
            this.practicaService.eliminarGrupo(this.grupo);
            //borrar las valoraciones de los alumnos del grupo
            this.practicaService.getValoraciones2(this.grupo).valueChanges()
              .subscribe( valoraciones => {
                this.valoraciones = valoraciones;

                for(let i=0; i<this.valoraciones.length; i++) {
                  if(this.valoraciones[i].grupoID == this.grupo.id) {
                    this.valoracionBorrada.practicaID = this.grupo.practicaID;
                    this.valoracionBorrada.key = this.valoraciones[i].key;
                    this.practicaService.eliminarValoracion(this.valoracionBorrada);
                  }
                }
            })
            
            //salir
            this.navCtrl.pop();
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

  

}
