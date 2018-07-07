import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoDetallePage } from './grupo-detalle';

@NgModule({
  declarations: [
    GrupoDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoDetallePage),
  ],
})
export class GrupoDetallePageModule {}
