import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Historico } from '../models/historico';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(private afs: AngularFirestore) { }

  // Criar
  public create(historico: Historico) {
    return this.afs.collection('historicos').add({...historico});
  }

  // Ler
  public getAll() {
    return this.afs.collection('historicos').snapshotChanges();
  }

  // Alterar
  public update(key: string, historico: Historico) {
    return this.afs.doc(`historicos/${key}`).update(historico);
  }

  // Deletar
  public delete(key: string) {
    return this.afs.doc(`historicos/${key}`).delete();
  }

}
