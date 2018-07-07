import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeProfesorPage } from './home-profesor';

@NgModule({
  declarations: [
    HomeProfesorPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeProfesorPage),
  ],
})
export class HomeProfesorPageModule {}
