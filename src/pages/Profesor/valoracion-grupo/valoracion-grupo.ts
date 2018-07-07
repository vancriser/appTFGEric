import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { practicaService } from '../../../services/practica.service';


@IonicPage()
@Component({
  selector: 'page-valoracion-grupo',
  templateUrl: 'valoracion-grupo.html',
})
export class ValoracionGrupoPage {
  
  recvData = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null };
  valoraciones = [];
  valoracionesGrupos = [];
  valoracionesFinal = [];
  yaEsta = false;
  alumnos = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService) {

    this.recvData = this.navParams.get('data');
    console.log(this.recvData)
    practicaService.getValoraciones(this.recvData).valueChanges()
      .subscribe( valoraciones => {
        this.valoraciones = valoraciones;

        let z=0;
        for(let i=0; i<this.valoraciones.length; i++){
          this.valoracionesGrupos[z] = this.valoraciones[i];
          for(let y=0; y<this.valoraciones.length; y++){
            if(this.valoraciones[i].grupoID == this.valoraciones[y].grupoID){
              this.valoracionesGrupos[z].media = Math.round(((this.valoraciones[i].media+this.valoraciones[y].media)/2)*100)/100
            }
          }
          z++;
          console.log("dentro del bucle")
        }
        console.log(this.valoracionesGrupos.length)
        console.log("fuera del bucle")

        let x= 0;
        for(let i=0; i<this.valoracionesGrupos.length;i++){
          for(let y=0; y<this.valoracionesGrupos.length;y++){
            this.yaEsta = false;
            if(this.valoracionesGrupos[i].grupoID == this.valoracionesGrupos[y].grupoID){
              for(let z=0; z<this.valoracionesFinal.length; z++){
                if(this.valoracionesFinal[z].grupoID == this.valoracionesGrupos[i].grupoID){
                  this.yaEsta = true;
                }
              }
              if(this.yaEsta == true) {console.log()}
              else {
                this.valoracionesFinal[x] = this.valoracionesGrupos[i];
                x++;
              }   
            }
          }
        }
        console.log(this.valoracionesGrupos)
        console.log(this.valoracionesFinal)

      });
  }


}
