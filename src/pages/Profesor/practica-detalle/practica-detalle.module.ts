import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticaDetallePage } from './practica-detalle';

@NgModule({
  declarations: [
    PracticaDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(PracticaDetallePage),
  ],
})
export class PracticaDetallePageModule {}
