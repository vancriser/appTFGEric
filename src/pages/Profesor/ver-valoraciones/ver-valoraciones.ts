import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//servicios
import { practicaService } from '../../../services/practica.service';
//componentes
import { ExpandableComponent } from '../../../components/expandable/expandable';
import { ValoracionGrupoPage } from '../valoracion-grupo/valoracion-grupo';


@IonicPage()
@Component({
  selector: 'page-ver-valoraciones',
  templateUrl: 'ver-valoraciones.html',
})
export class VerValoracionesPage {

  recvData = { id: null, asignatura: null, name: null, inicio: null, fin: null, info: null };
  valoraciones = [];
  itemExpanded: boolean = false;
  itemExpandHeight: number = 200;
  values = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public practicaService: practicaService) {
    
    this.recvData = this.navParams.get('data');

    practicaService.getValoraciones(this.recvData).valueChanges()
      .subscribe( valoraciones => {
        this.valoraciones = valoraciones;
      });

  }

  expandItem(item){
    this.itemExpanded = !this.itemExpanded;
  }

  showMessage(e){
    console.log("hago clic "+this.values);
    e.preventDefault();
  }

  valoracionGrupos(){
    this.navCtrl.push(ValoracionGrupoPage, {'data': this.recvData})
  }

}
