import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { practicaService } from '../../../services/practica.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { profileService } from '../../../services/profile.service';
import { HomeProfesorPage } from '../home-profesor/home-profesor';
import { VerGruposPage } from '../ver-grupos/ver-grupos';

@IonicPage()
@Component({
  selector: 'page-anyade-grupos',
  templateUrl: 'anyade-grupos.html',
})
export class AnyadeGruposPage {

  recvData = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null };
  practica = {id: null, asignatura: null, name: null, inicio:null, fin: null, info: null, grupo: {}};
  grupo = {id: null, keyAlumnos: null, name: null, alumnos: []};
  profiles = [];
  values = [];
  grupoList = [];
  alumnos = [];
  posibleFinalizar = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService, public alertCtrl: AlertController,
    private afAuth: AngularFireAuth, public profileService: profileService) {

      this.recvData = this.navParams.get('data');
      this.practica.id = this.recvData.id;
      this.practica.asignatura = this.recvData.asignatura;
      this.practica.name = this.recvData.name;
      this.practica.inicio = this.recvData.inicio;
      this.practica.fin = this.recvData.fin;
      this.practica.info = this.recvData.info;

    /*let anteriorPage = this.navCtrl.last();
    if(anteriorPage.component.name == "VerGruposPage") {this.posibleFinalizar = false;}
    else {this.posibleFinalizar = true;}*/

    profileService.getProfiles().valueChanges()
      .subscribe( profiles => {
        this.profiles = profiles;

        this.profiles = this.profiles.filter((profile) => {
          return profile.rol == "alumno";
        });
      }); 

    practicaService.getAlumnos(this.practica).valueChanges()
      .subscribe( alumnos => {
        this.alumnos = alumnos;
        
          //x es necesaria para que se puedan hacer grupos de tamaños diferentes y no fallen los bucles
          let x = this.profiles.length-2;
          console.log(this.alumnos);
          console.log(this.alumnos.length)
          for(let n=0; n<this.alumnos.length; n++){
            for(let i=0; i<=this.alumnos.length+x; i++){
              if(this.alumnos[n][i] == null) {console.log("break 1");break;}
              else{
                for(let y=0; y<this.profiles.length; y++){
                  console.log("n ="+n)
                  console.log("i ="+i)
                  console.log("y ="+y)
                  console.log("ID profiles["+y+"] ="+this.profiles[y].id)
                  console.log("ID alumnos["+n+"]["+i+"] ="+this.alumnos[n][i].id)
                  if(this.alumnos[n][i]!=null && this.profiles[y].id == this.alumnos[n][i].id){
                    this.profiles.splice(y, 1);
                    console.log("break 2");
                    break;
                  }
                  else{console.log();}
                }
              }
              
            }
          }
    });
  }

  showMessage(e){
    console.log("hago clic "+this.values);
    e.preventDefault();
  }

  addGroup(){
    //console.log(this.values.length);
    while(this.grupoList.length > 0){this.grupoList.pop();}
    let y=0;
    for(let i=0; i<this.values.length; i++){
      //console.log("Iteracion numero: "+i);
      if(this.values[i] == true){
        this.grupoList[y] = this.profiles[i];
        y++;
        //console.log("Se ha añadido en la iteracion: "+i);
      }
      
    }
    //console.log(this.grupoList);
    //ya tengo la lista con los alumnos añadidos
    //pasar esta lista a la lista alumno de la variable grupo
    this.grupo.alumnos = this.grupoList;
    this.practica.grupo = this.grupo;
    //si la practica no existe, crear la practica con el grupo
    //si la practica existe, anyadir el grupo
    if(this.grupo.name == null){
      let alert = this.alertCtrl.create({
        title: 'Introduce el nombre del grupo.',
        buttons: ['OK']
      });
      alert.present();
    }
    else{
      if(this.grupoList.length == 0){
        let alert = this.alertCtrl.create({
          title: 'Selecciona un alumno como mínimo.',
          buttons: ['OK']
        });
        alert.present();
      }
      else{
        this.practicaService.anyadirGrupos(this.practica);
        let alert = this.alertCtrl.create({
          title: 'Grupo añadido con éxito!',
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.setRoot(VerGruposPage, {'data': this.practica});
      }
    }
    
    
  }

  finalizar(){
    this.navCtrl.setRoot(VerGruposPage, {'data': this.practica});
  }
  
}

