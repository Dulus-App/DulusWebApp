import { Injectable } from '@angular/core';

// Models
import { perfilEstabModel } from 'src/app/models/perfilEstab.model';

// Firebase
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { servicosEstabModel } from 'src/app/models/servicosEstab.model';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  public perfilEstab: any = {};
  public myServicos: any = [];
  
  constructor(
              public  firestore:   AngularFirestore,
              private afDatabase:  AngularFireDatabase,
              public  afAuth:      AngularFireAuth) { 
                
  }
   
  /*****************
    TAB - MEU PERFIL
  ******************/

  // Atualzação dos dados cadastrais da aplicação.
  postNewEstabData(uid: string, newData: perfilEstabModel) {

    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('perfil').doc(`${uid}`).set({
          nomeEstab:   newData.nomeEstab,
          descEstab:   newData.descEstab,
          telefone:    newData.telefone,
          telefone2:   newData.telefone2,
          rua:         newData.rua,
          cidade:      newData.cidade,
          bairro:      newData.bairro,
          estado:      newData.estado,
          cep:         newData.cep,
          numero:      newData.numero,
          complemento: newData.complemento,
          img_url:     newData.img_url,
    });
  }

  // Buscar dados para exibição no formulário
  getEstabData(uid: string) { 
  
    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('perfil').doc(`${uid}`).valueChanges();
  }

  // Atualizar a url da imagem escolhida de capa.
  atualizaUrlImage(uid: string, userData: any, url: string) {

    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('perfil').doc(`${uid}`).set({
      nomeEstab:   userData.nomeEstab,
      descEstab:   userData.descEstab,
      telefone:    userData.telefone,
      telefone2:   userData.telefone2,
      rua:         userData.rua,
      cidade:      userData.cidade,
      bairro:      userData.bairro,
      estado:      userData.estado,
      cep:         userData.cep,
      numero:      userData.numero,
      complemento: userData.complemento,
      img_url:     url
    });
  }
  

  /***************
    TAB - SERVIÇOS
  ****************/

  // Criação de um novo serviço
  postNewService(uid: string, servicoData: any) {

    let timestamp = Date.now().toString();
    // Gera numeração random `${Math.random().toString()}`
    
   return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('servicos').doc(`${timestamp}`).set({
      nomeServico:  servicoData.nomeServico,
      descServico:  servicoData.descServico,
      valorServico: servicoData.valorServico,
      periodo:      servicoData.periodo,
      postagens:    servicoData.postagens,
      albuns:       servicoData.albuns,
      canal:        servicoData.canal,
      timestamp:    firebase.firestore.FieldValue.serverTimestamp()    
    });
  }

  // Buscar todos os serviços cadastrados
  getAllService(uid: string) {
    var docRef = this.firestore.collection(`estabelecimentos/${uid}/servicos`);
    return docRef.snapshotChanges();
    //return this.firestore.collection(`estabelecimentos/${uid}/servicos`).snapshotChanges();
  }

  // Buscar serviço por ID
  getServiceById(uid: string, serviceId: any) {

    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('servicos').doc(`${serviceId}`).valueChanges();
  }


  // Editar por ID
  editServiceById(uid: string, serviceId: string, dadosEditados: servicosEstabModel) {

    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('servicos').doc(`${serviceId}`).update({
      nomeServico:  dadosEditados.nomeServico,
      descServico:  dadosEditados.descServico,
      valorServico: dadosEditados.valorServico,
      periodo:      dadosEditados.periodo,
      postagens:    dadosEditados.postagens,
      albuns:       dadosEditados.albuns,
      canal:        dadosEditados.canal,
    });

  }


  // Deletar item por ID
  deleteItemService(uid: string, itemId: string) {

    return this.firestore.collection('estabelecimentos').doc(`${uid}`).collection('servicos').doc(`${itemId}`).delete();
  }

}
