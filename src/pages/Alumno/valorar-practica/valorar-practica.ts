import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//import de servicios
import { practicaService } from '../../../services/practica.service';
import { profileService } from '../../../services/profile.service';
//imports firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';



@IonicPage()
@Component({
  selector: 'page-valorar-practica',
  templateUrl: 'valorar-practica.html',
})
export class ValorarPracticaPage {

  recvData = {id: null, asignatura: null, name: null, inicio:null, fin: null, info: null}
  practica = {id: null, asignatura: null, name: null, inicio:null, fin: null, info: null, valoracion: {}}
  valoracion = {grupoID: null, grupoName: null, userID:null, username:null, comunicacion: null, reparto: null, comp1Name: null, comp1: null, textComp1: null, comp2Name: null, comp2: null, textComp2: null, comp3Name: null, comp3:null, textComp3: null,
                normas: null, partes: null, satisfaccion: null, criticas: null, decisiones: null, placer: null, media: null, key: null}
  profiles = []
  values = [];
  grupos = [];
  alumnosDelGrupo = [];
  unCompanero = false;
  dosCompaneros = false;
  tresCompaneros = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService,public alertCtrl: AlertController,
    private afAuth: AngularFireAuth, private afDB: AngularFireDatabase,
    public profileService: profileService) {

      this.recvData = this.navParams.get('data');
      this.practica.id = this.recvData.id;
      this.practica.asignatura = this.recvData.asignatura;
      this.practica.name = this.recvData.name;
      this.practica.inicio = this.recvData.inicio;
      this.practica.fin = this.recvData.fin;
      this.practica.info = this.recvData.info;

      //obtencion del username
      profileService.getProfiles().valueChanges()
      .subscribe( profiles => {
        this.profiles = profiles;
        this.afAuth.authState.subscribe(
          auth => {
            this.profiles = this.profiles.filter( (profile) => {
              return profile.id == auth.uid;
              }
            )
          }
        )
        this.afAuth.authState.subscribe(
          auth => {
              if(this.profiles[0].username != null) this.valoracion.username = this.profiles[0].username;
              this.obtencionGrupos();
          }
        )
      }); 
  }

  obtencionGrupos(){
    //obtencion de los grupos
    this.practicaService.getGrupos(this.recvData).valueChanges()
    .subscribe(grupos => {
      this.grupos = grupos;

      for(let i=0; i< this.grupos.length; i++){
        console.log(this.grupos[i])
        for(let y=0; y<this.grupos[i].alumnos.length; y++){
          console.log(this.grupos[i].alumnos[y].id)
          if(this.grupos[i].alumnos[y].id == this.profiles[0].id) {
            this.valoracion.grupoID = this.grupos[i].id;
            this.valoracion.grupoName = this.grupos[i].name;
          }
        }
      }

      let u=0;
      for(let i=0; i< this.grupos.length; i++){
        if(this.grupos[i].id == this.valoracion.grupoID){
          for(let y=0; y<this.grupos[i].alumnos.length; y++){
            this.alumnosDelGrupo[u] = this.grupos[i].alumnos[y] ;
            u++;
          }
        }
      }
      console.log("lenght del grupo antes= ",this.alumnosDelGrupo.length)
      for(let i=0; i<this.alumnosDelGrupo.length; i++){
        console.log(this.alumnosDelGrupo[i].username)
        console.log(this.profiles[0].username)
        if(this.alumnosDelGrupo[i].username == this.profiles[0].username) {
          this.alumnosDelGrupo.splice(i, 1);
        }
      }
      console.log("lenght del grupo despues= ",this.alumnosDelGrupo.length)
      if(this.alumnosDelGrupo.length == 1){this.unCompanero = true;}

        if(this.alumnosDelGrupo.length == 2) {
          this.unCompanero = true;
          this.dosCompaneros = true;
        }
        if(this.alumnosDelGrupo.length == 3){
          this.unCompanero = true;
          this.dosCompaneros = true;
          this.tresCompaneros = true;
        }
      
      console.log("1Companero", this.unCompanero)
      console.log("2Companero", this.dosCompaneros)
      console.log("3Companero", this.tresCompaneros)
    });
  }

  addValoracion(){
    //añadir el uid del usuario a la valoracion
    if(this.valoracion.comunicacion == null) this.valoracion.comunicacion = 1;
    if(this.valoracion.reparto == null) this.valoracion.reparto = 1;
    if(this.valoracion.normas == null) this.valoracion.normas = 1;
    if(this.valoracion.partes == null) this.valoracion.partes = 1;
    if(this.valoracion.satisfaccion == null) this.valoracion.satisfaccion = 1;
    if(this.valoracion.criticas == null) this.valoracion.criticas = 1;
    if(this.valoracion.decisiones == null) this.valoracion.decisiones = 1;
    if(this.valoracion.placer == null) this.valoracion.placer = 1;
    if(this.unCompanero == true) {
      this.valoracion.comp1Name = this.alumnosDelGrupo[0].username;
      if(this.valoracion.comp1 == null) this.valoracion.comp1 = 1;
    }
    if(this.dosCompaneros == true) {
      this.valoracion.comp2Name = this.alumnosDelGrupo[1].username;
      if(this.valoracion.comp2 == null) this.valoracion.comp2 = 1;
    }
    if(this.tresCompaneros == true) {
      this.valoracion.comp3Name = this.alumnosDelGrupo[2].username;
      if(this.valoracion.comp3 == null) this.valoracion.comp3 = 1;
    }
    this.valoracion.media = Math.round(((this.valoracion.comunicacion + this.valoracion.reparto + this.valoracion.comp1 + this.valoracion.comp2 +
      this.valoracion.comp3 + this.valoracion.normas + this.valoracion.partes + this.valoracion.satisfaccion + this.valoracion.criticas +
      this.valoracion.decisiones + this.valoracion.placer)/11)*100)/100;

    //Math.round(this.valoracion.media * 100)/100

    this.afAuth.authState.subscribe(
      auth => {
        this.valoracion.userID = auth.uid;
        this.practica.valoracion = this.valoracion;
        this.practicaService.valorarPractica(this.practica);
        //informacion de que se ha añadido
        let alert = this.alertCtrl.create({
          title: 'Valoración añadida con éxito!',
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.pop();
      }
    )
  }

}
