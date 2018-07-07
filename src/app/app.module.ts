import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//http
import { HttpClientModule } from '@angular/common/http'; 
//servicio de usuarios
import { usersService } from '../services/users.service';
import { practicaService } from '../services/practica.service';
import { profileService } from '../services/profile.service';

//componentes
import { ExpandableComponent } from '../components/expandable/expandable';

//imports de las nuevas paginas
import { MyApp } from './app.component';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { HomeProfesorPage } from '../pages/Profesor/home-profesor/home-profesor';
import { AnyadeGruposPage } from '../pages/Profesor/anyade-grupos/anyade-grupos';
import { CreatePracticaPage } from '../pages/Profesor/create-practica/create-practica';
import { OldPracticasPage } from '../pages/Profesor/old-practicas/old-practicas';
import { ViewPracticasPage } from '../pages/Profesor/view-practicas/view-practicas';
import { PracticaDetallePage } from '../pages/Profesor/practica-detalle/practica-detalle';
import { ProfilePage } from '../pages/profile/profile';
import { ValorarPracticaPage } from '../pages/Alumno/valorar-practica/valorar-practica';
import { VerGruposPage } from '../pages/Profesor/ver-grupos/ver-grupos';
import { VerValoracionesPage } from '../pages/Profesor/ver-valoraciones/ver-valoraciones';
import { GrupoDetallePage } from '../pages/Profesor/grupo-detalle/grupo-detalle';
import { ValoracionGrupoPage } from '../pages/Profesor/valoracion-grupo/valoracion-grupo';

//imports de angular fire2 (firebase para angular)
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//código para poder usar firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDoacVO0g3DBs81jaqKJbvCpIez52w96Xg",
  authDomain: "apptfg-5b47e.firebaseapp.com",
  databaseURL: "https://apptfg-5b47e.firebaseio.com",
  storageBucket: "apptfg-5b47e.appspot.com",
  messagingSenderId: "234353177238"

};

//declarations=las paginas, entryComponents=las paginas
@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    SignupPage,
    HomeProfesorPage,
    CreatePracticaPage,
    OldPracticasPage,
    ViewPracticasPage,
    PracticaDetallePage,
    ProfilePage,
    ValorarPracticaPage,
    AnyadeGruposPage,
    VerGruposPage,
    VerValoracionesPage,
    ExpandableComponent,
    GrupoDetallePage,
    ValoracionGrupoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    SignupPage,
    HomeProfesorPage,
    CreatePracticaPage,
    OldPracticasPage,
    ViewPracticasPage,
    PracticaDetallePage,
    ProfilePage,
    ValorarPracticaPage,
    AnyadeGruposPage,
    VerGruposPage,
    VerValoracionesPage,
    GrupoDetallePage,
    ValoracionGrupoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AngularFireAuthModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    usersService,
    practicaService,
    profileService
  ]
})
export class AppModule {}
