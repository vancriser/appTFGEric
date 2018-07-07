import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { Observable } from '@firebase/util';
import * as firebase from 'firebase/app';

@Injectable()
export class practicaService {
    constructor(public afDB: AngularFireDatabase) { }

    practicasActivas = [];
    gruposCreados = [];
    grupos = [];
    alumnos = [];
    valoraciones = [];

    //devuelve todas las practicas existentes, de momento
    public getPracticasActivas() {
        return this.afDB.list('practicas/');
    }

    public createPractica(practica) {
        this.afDB.database.ref('practicas/' + practica.id).set(practica);
    }

    //edita practica
    public editarPractica(practica) {
        this.afDB.database.ref('practicas/' + practica.id).set(practica);
    }

    //elimina la practica seleccionada
    public eliminarPractica(practica) {
        this.afDB.database.ref('practicas/' + practica.id).remove();
    }

    //añade grupos
    public anyadirGrupos(practica){
        //grupo
        let key = this.afDB.database.ref('practicas/' + practica.id + '/grupos/').push(practica.grupo).key;
        practica.grupo.id = key;
        this.afDB.database.ref('practicas/' + practica.id + '/grupos/' + key).set(practica.grupo);
        //alumnos
        let key2 = this.afDB.database.ref('practicas/' + practica.id + '/listaAlumnos/').push(practica.grupo.alumnos).key;
        practica.grupo.keyAlumnos = key2;
        this.afDB.database.ref('practicas/' + practica.id + '/grupos/' + key).set(practica.grupo);
    }

    //borrar grupos
    public eliminarGrupo(grupo){
        this.afDB.database.ref('practicas/' + grupo.practicaID + '/grupos/' + grupo.id).remove();
        this.afDB.database.ref('practicas/' + grupo.practicaID + '/listaAlumnos/' + grupo.keyAlumnos).remove();
    }


    //añade valoracion
    public valorarPractica(practica) {
        let key = this.afDB.database.ref('practicas/' + practica.id + '/valoracion/').push(practica.valoracion).key;
        practica.valoracion.key = key;
        this.afDB.database.ref('practicas/' + practica.id + '/valoracion/' + key).set(practica.valoracion);
    }
    
    public eliminarValoracion(valoracionBorrada){
        this.afDB.database.ref('practicas/' + valoracionBorrada.practicaID + '/valoracion/' + valoracionBorrada.key).remove();
    }

    //filter es para filtrar lo que coge
    //devuelve la practica en la que estas para poder ver su info
    public getPractica(id) {
        return this.afDB.object('practicas/' + id);
    }

    public getGrupos(practica){
        return this.afDB.list('practicas/' + practica.id + '/grupos/');
    }

    public getAlumnos(practica){
        return this.afDB.list('practicas/' + practica.id +'/listaAlumnos/')
    }

    /*mismo codigo pero para obtener los alumnos desde grupo-detalle, ya que ahi tengo el grupo
    pero no la practica*/
    public getAlumnos2(grupo){
        return this.afDB.list('practicas/' + grupo.practicaID +'/listaAlumnos/')
    }

    public getValoraciones(practica){
        return this.afDB.list('practicas/' + practica.id + '/valoracion/')
    }

    //desde grupo-detalle
    public getValoraciones2(grupo){
        return this.afDB.list('practicas/' + grupo.practicaID + '/valoracion/')
    }

    

}