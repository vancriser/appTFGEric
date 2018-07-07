import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePracticaPage } from './create-practica';

@NgModule({
  declarations: [
    CreatePracticaPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePracticaPage),
  ],
})
export class CreatePracticaPageModule {}
