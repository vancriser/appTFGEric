import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import servicio practicas
import { practicaService } from '../../../services/practica.service';
//firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
//imports de otras paginas
import { PracticaDetallePage } from '../practica-detalle/practica-detalle';
//import para fechas
import * as moment from 'moment';
import { AngularFireAuth } from 'angularfire2/auth';
import { profileService } from '../../../services/profile.service';

@IonicPage()
@Component({
  selector: 'page-old-practicas',
  templateUrl: 'old-practicas.html',
})
export class OldPracticasPage {

  practicasActivas = [];
  practicasIntermedias = [];
  recvData = false;
  alumnos = [];
  profiles = [];
  alumnoExiste = false;
  profesorUID = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService, public profileService: profileService,
    private afAuth: AngularFireAuth) {

      this.recvData = this.navParams.get('data');

      practicaService.getPracticasActivas().valueChanges()
        .subscribe(practicasActivas => {
          this.practicasActivas = practicasActivas;
          //filtro para mostrar las finalizadas
          this.practicasActivas = this.practicasActivas.filter((practicaActiva) => {
            practicaActiva.fin = practicaActiva.fin.toString();
            const date = moment().format("YYYY-MM-DD");
            return practicaActiva.fin < date;
          });
          if (this.recvData == true) { 
            this.filtrarPracticasProfesor();
            //this.practicasIntermedias = this.practicasActivas;
            console.log("soy profesor, puedo verlo todo")
           }
          else {
            this.recogerListadoAlumnos();
          }
        });
  }

  public recogerListadoAlumnos() {

    //cojo mi perfil
    this.profileService.getProfiles().valueChanges()
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
      });

    let u = 0;
    for (let z = 0; z < this.practicasActivas.length; z++) {
      //this.practicasActivas.length

      console.log(this.practicasActivas[z])
      this.practicaService.getAlumnos(this.practicasActivas[z]).valueChanges()
        .subscribe(alumnos => {
          this.alumnos = alumnos;
          //console.log("practica numero= " + z);
          
          

          //x es necesaria para que se puedan hacer grupos de tamaños diferentes y no fallen los bucles
          //let x = this.profiles.length-2;
          console.log(this.alumnos)
          console.log(this.alumnos.length)
          for (let m = 0; m < this.alumnos.length; m++) {
            this.alumnoExiste = false;
            console.log(this.alumnos[m])
            console.log(this.alumnos[m].length)
            for (let n = 0; n < this.alumnos[m].length; n++) {
              console.log(this.alumnos[m][n])
                if (this.alumnos[m][n] == null) { console.log("break 1"); break; }
                else {
                  if (this.alumnos[m][n] != null && this.profiles[0].id == this.alumnos[m][n].id) {
                    this.alumnoExiste = true;
                    this.practicasIntermedias[u] = this.practicasActivas[z];
                    console.log("Esto es la practica que se ha añadido: ")
                    console.log(this.practicasActivas[z])
                    u++;
                    console.log("break 2");
                    break;
                  }
                  else { console.log(); }

                }
                console.log(this.alumnoExiste)

              
            }
          }
          console.log(this.practicasIntermedias)
        }
        )
        
    }

  }

  public filtrarPracticasProfesor() {
    /*coger todas las practicas (ya las tengo)
      coger my UID
      filtrar las practicas que tengan my UID como creadorID
    */
    let u=0;
    //coger UID
    this.profileService.getProfiles().valueChanges()
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
              if (this.profiles[0].id != null) this.profesorUID = this.profiles[0].id;
              //filtrar
              for(let i=0; i<this.practicasActivas.length; i++){
                if(this.practicasActivas[i].creadorID == this.profesorUID) {
                  this.practicasIntermedias[u] = this.practicasActivas[i];
                  u++;
                }
                else {console.log();}
              }
            }
          )
        });
  }

  public verDetalle(practicaActiva) {
    this.navCtrl.push(PracticaDetallePage, { 'data': practicaActiva })
  }
}
