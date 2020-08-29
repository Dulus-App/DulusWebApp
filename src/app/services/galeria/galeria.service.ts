import { async } from '@angular/core/testing';
import { LoadingService } from './../loading/loading.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

// Models
import { newAlbumData } from './../../models/albumData.model';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
//import * as firebase from 'firebase';
import { ToastControllerService } from '../toastController/toast-controller.service';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class GaleriaService {

  public dateTime: any;
  public UploadedFileURL: Observable<string>;
  public UploadedFileURLAlbum: Observable<string>;
  public urlImage: string;
  public urlImageAlbum: string;
  public fileName: string;

  public dataFilter: newAlbumData = new newAlbumData();

  public imagensGaleria = [];

  constructor(
              public  loadingCtrl: LoadingService,
              public  toastCtrl:   ToastControllerService,
              public  afDatabase:  AngularFireDatabase,
              private storage:     AngularFireStorage) { 

  }

  // Criar novo album
 async createNewAlbum(uid: string, albumData: newAlbumData) {

    console.log("uid: ", uid);
    console.log("albumData: ", albumData);
    this.dateTime = Date.now();
    
  await this.afDatabase.object(`galeria/${uid}/albuns/${this.dateTime}`).set({
      albumId:   this.dateTime,
      nomeAlbum: albumData.nomeAlbum,
      descAlbum: albumData.descAlbum
    }).then((response) => {
      console.log(response);
      
      
    }, (err) => {
      console.log(err);
      
      return false;
    });
  }


  // Editar dados de um album
  async editAlbumGalery(uid: string, albumDataId: any, albumData: newAlbumData) {
    console.log("albumData values: ", albumData);
    console.log("albumDataId values: ", albumDataId);
    
   await this.afDatabase.object(`galeria/${uid}/albuns/${albumDataId.albumId}`).update({
    albumId:   albumDataId.albumId,
    nomeAlbum: albumData.nomeAlbum,
    descAlbum: albumData.descAlbum,
    fileName:  albumDataId.fileName,
    urlImage:  albumData.capa
   }).then(() => {
     return true;
   })

  }

  // Deletar imagem do album
  async deleteImagesFromAlbum(uid: string, imagePath: string) {

    return await this.storage.ref(imagePath).delete();

  }

  // Deletar referencia da imagem no realtime database
  async deleteRefAlbumDatabase(uid: string, albumId: any) {
    
    return await this.afDatabase.object(`album/${uid}/${albumId.albumId}/${albumId.itemId}`).remove();
  }


  // Deletar album da galeria
  async deleteGaleryAlbum(uid: string, galeryItem: any) {

    console.log("galeryItem: ", galeryItem);
   
    this.storage.ref(`estabelecimentos/galerias/${uid}/${galeryItem.fileName}`).delete()
      .subscribe(() => {

        // Excluir o registro do realtime database
        this.afDatabase.object(`galeria/${uid}/albuns/${galeryItem.albumId}`).remove().then(() => {

          // Mostrar mensagem de sucesso
          this.toastCtrl.presentToast("Álbum deletado com sucesso.");
        })
      })
  }


  // Listar todos os albuns de um estabelecimento
  listAllAlbuns(uid: string) {

    return this.afDatabase.list(`galeria/${uid}/albuns`).valueChanges();
  }

  // Deletar capa antiga
  async modificaCapaAntiga(uid: string, refImgCapa: FileList, editedAlbum: any) {
    console.log("refImgCapa: ", refImgCapa);
    console.log("editedAlbum: ", editedAlbum);

      // Show Loading
      this.loadingCtrl.showLoadingWithMessage("Aguarde");
    
      const file = refImgCapa.item(0);
      // Caminho para salvar a nova capa
      const path = `estabelecimentos/galerias/${uid}/${editedAlbum.fileName}`;

      // URL de retorno da nova imagem armazenada no storage
      let newUrlImg: string;
      let uploadFileURL: Observable<string>;

      //File reference
      const fileRef = this.storage.ref(path);

        // Subir a nova imagem de capa
        this.storage.ref(path).put(file).then(() => {
          uploadFileURL = fileRef.getDownloadURL();
          
          /*
          filename.subscribe(data => {
            console.log("metadata: ", data);
            
          });
          */


            uploadFileURL.subscribe(resp => {

              newUrlImg = resp;
              // Após receber a URL add ao registro no realtime database
      
              // Atualizar referencia no realtime database
            this.afDatabase.object(`galeria/${uid}/albuns/${editedAlbum.albumId}`).update({
                urlImage: newUrlImg,
              }).then(() => {
                // Dismiss loadind
                this.loadingCtrl.dismissLoading();
              })
        
            });
          });     
        
          // DEIXAR PARA O FINAL
          // Deletar imagem do storage
    /*  await this.storage.ref(`estabelecimentos/galerias/${uid}/${editedAlbum.fileName}`).delete().subscribe(() => {
      
      });  

      */

  }


  // Upload de imagens
  uploadImages(uid: string, event: FileList) {

    console.log(uid);
    console.log(event);


    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ');
      return;
     } 

     // Definir um filename ao salvar o arquivo
     this.fileName =  this.afDatabase.createPushId();
    // Corresponde ao caminho da imagem dentro do storage do Firebase
    const path = `estabelecimentos/galerias/${uid}/${this.fileName}`; 

    //File reference
    const fileRef = this.storage.ref(path);

    // Realiza upload no storage do Firebase
    this.storage.upload(path, file).then(() => {
      
      // Retornar a URL da imagem
      this.UploadedFileURL = fileRef.getDownloadURL();

    return this.UploadedFileURL.subscribe(resp => {
        this.urlImage = resp;
        console.log("this.urlImage: ", this.urlImage);

        // Após receber a URL da imagem, armazenar o caminho da capa no Realtime Database
        this.afDatabase.object(`galeria/${uid}/albuns/${this.dateTime}`).update({
          urlImage: this.urlImage,
          fileName: this.fileName
        });
        
        
      });
      
    });

  }


  // Realiza o UPDATE da URL da imagem ao receber o retorno do STORAGE do Firebase
  uploadImageAlbum(uid: string, albumId: any, event: FileList) {


    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ');
      return;
     } 

     // Definir um filename ao salvar o arquivo
     this.fileName =  this.afDatabase.createPushId();
    // Corresponde ao caminho da imagem dentro do storage do Firebase
    const path = `estabelecimentos/galerias/${uid}/${this.fileName}`; 

    //File reference
    const fileRef = this.storage.ref(path);


    var promessa = new Promise((resolve, reject) => { 


    this.storage.upload(path, file).then(() => {

      // Retornar a URL da imagem
      this.UploadedFileURLAlbum = fileRef.getDownloadURL();
      fileRef.getMetadata().subscribe(metadata => {
        console.log("metadata: ", metadata);
        let size = metadata.size;
      })

      this.UploadedFileURLAlbum.subscribe(resp => {
        this.urlImageAlbum = resp;
        let id =  Date.now();
        this.afDatabase.object(`album/${uid}/${albumId}/${id}`).set({
          
          imagePath: path,
          imageItem: this.urlImageAlbum,
          albumId: albumId,
          itemId:  id,
        }).then((data) => {

          this.getAllImagesAlbum(`${uid}`, `${albumId}`).subscribe((data: any) => {
            console.log("passou no teste");
            
            resolve(data);
          })

          return resolve;
        }, (err) => {
          console.log(err);
          
        })
      });

    });
    
  });
  
  return promessa;


}


  // Busca imagens de um album
 getImagesAlbum(uid: string, albumId: any) {
    
    // Método com limite de busca em testes

    let num = 3;
    
    const db = firebase.database();
    
    const dataRef = db.ref(`album/${uid}/${albumId}`);
    const query = dataRef.limitToLast(10); //.orderByChild('itemId').
    let array = new Array;
    
    var promessa = new Promise((resolve, reject) => { 
    
    query.on('value', snapshot => {
      snapshot.forEach( function (snap) {
        array.push({ key: snap.key, ...snap.val() });
      });
      console.log("array service: ", array);
      
        resolve(array);
      });
    });   
    return promessa;
  } 
 

  getAllImagesAlbum(uid: string, albumId: string) {

    return this.afDatabase.list(`album/${uid}/${albumId}`).valueChanges();

  }


}
