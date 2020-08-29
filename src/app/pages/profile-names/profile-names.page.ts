import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

// Services
import { AuthServiceService } from './../../services/auth/auth-service.service';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { ServiceCepService } from 'src/app/services/cep/service-cep.service';
import { InfoService } from 'src/app/services/info/info.service';

// Models
import { userAuthModel } from 'src/app/models/user.model';
import { perfilEstabModel } from 'src/app/models/perfilEstab.model';


export class NomeDescEstab {
  nomeEstab: string;
  descEstab: string;
  tel1: string;
  tel2: string;
  cep: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
  imageUrl: string;
 }


@Component({
  selector: 'app-profile-names',
  templateUrl: './profile-names.page.html',
  styleUrls: ['./profile-names.page.scss'],
})
export class ProfileNamesPage implements OnInit {

  task: AngularFireUploadTask;
  fileName:string;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  // Snapshot of uploading file
  snapshot: Observable<any>;

  public uidCurrentUser: string;
  public urlImage: string;
  //public estabData: NomeDescEstab = new NomeDescEstab();
  public estabData: perfilEstabModel  = new  perfilEstabModel();

  public authCurrent: userAuthModel = new userAuthModel();
  
  public dadosProfile: any;

  // Variável para edição do formulário
  public editField: boolean = false;

  constructor(
              private storage:      AngularFireStorage,
              public  cepService:   ServiceCepService,
              private localStorage: Storage,
              public  infoService:  InfoService,
              public  authService:  AuthServiceService   ) { }

  ngOnInit() {

    this.localStorage.get('uid').then(data => {
      this.uidCurrentUser = data;
      
      this.getDadosEstabelecimento();
    });

  }


  // Upload de imagens
  uploadFile(event: FileList){

    const file = event.item(0)
    
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
     } 

     // Verificar regra para filename. UID?
     this.fileName =  this.uidCurrentUser; // UID como nome da imagem.

     // Corresponde ao caminho da imagem dentro do storage do Firebase
     const path = `estabelecimentos/${this.fileName}`; 
   // var storageRef = firebase.storage().ref()

   //File reference
   const fileRef = this.storage.ref(path);

   this.storage.upload(path, file).then(() => {
     
     this.UploadedFileURL = fileRef.getDownloadURL();
     // Get uploaded file storage pat
     this.UploadedFileURL.subscribe(resp=>{
      this.urlImage = resp;
     // this.estabData.img_url = resp; 
     console.log(this.urlImage);

      console.log("Campo descrição: ", this.estabData.descEstab);
      
      if(this.estabData.descEstab == undefined) {
        this.estabData.descEstab = '';
      }
     

      // Após receber URL da imagem, armazenar no Firestore
     /* this.infoService.atualizaUrlImage(this.uidCurrentUser, this.estabData, this.urlImage).then(() => {
        
        console.log("URL image atualizada com sucesso.");
        
      }) */

      this.estabData.img_url = this.urlImage;


      }, (erro => {
        console.error(erro);
      }))
   });

  }

  // Buscar o CEP
  getCEP() {
    this.cepService.getServiceCep(this.estabData.cep)
      .subscribe((data) => {
        console.log(data);
        this.estabData.rua         = data.logradouro;
        this.estabData.cidade      = data.localidade;
        this.estabData.bairro      = data.bairro;
        this.estabData.estado      = data.estado;
        this.estabData.numero      = data.numero;
        this.estabData.complemento = data.complemento;
      });
  }

  getLocation() {
    console.log(this.estabData);
  }

  getDadosEstabelecimento() {

    console.log("this.uidCurrentUser: ", this.uidCurrentUser);
    
    this.infoService.getEstabData(this.uidCurrentUser).subscribe(data => {
    
    // Atribuição do retorno do service
    this.dadosProfile = data;
    console.log("this.dadosProfile: ", this.dadosProfile);
    
    
    // Atribuição aos campos do formulário
    this.estabData.nomeEstab   = this.dadosProfile.nomeEstab;
    this.estabData.descEstab   = this.dadosProfile.descEstab;
    this.estabData.cep         = this.dadosProfile.cep;
    this.estabData.complemento = this.dadosProfile.complemento;
    this.estabData.cidade      = this.dadosProfile.cidade;
    this.estabData.estado      = this.dadosProfile.estado;
    this.estabData.numero      = this.dadosProfile.numero;
    this.estabData.rua         = this.dadosProfile.rua;
    this.estabData.bairro      = this.dadosProfile.bairro;
    this.estabData.telefone    = this.dadosProfile.telefone;
    this.estabData.telefone2   = this.dadosProfile.telefone2;
    this.estabData.img_url     = this.dadosProfile.img_url; 
    this.urlImage              = this.dadosProfile.img_url;

    console.log("this.dadosProfile.img_url: ", this.dadosProfile.img_url);
    console.log("this.urlImage: ", this.urlImage);
    console.log("this.estabData.img_url: ", this.estabData.img_url);
    
  /*  if(this.dadosProfile.img_url == undefined) {
      
      this.estabData.img_url = this.urlImage;
    }
    else {
      this.estabData.img_url = this.dadosProfile.img_url;
    } */

   // this.estabData.img_url     = this.dadosProfile.img_url;

    // Atribuição da url da imagem de capa
   // this.urlImage = this.estabData.img_url;

  }, (erro) => {
    console.log(erro);
    
  });


  }

  editarCampos() {
    
    // Habilita e desabilita a edição de campos no formulário.
    if(this.editField == true) {
      // Passa aqui ao clicar no botão cancelar
      this.editField = false;

    // Atribuição aos campos do formulário
    this.estabData.nomeEstab   = this.dadosProfile.nomeEstab;
    this.estabData.descEstab   = this.dadosProfile.descEstab;
    this.estabData.cep         = this.dadosProfile.cep;
    this.estabData.complemento = this.dadosProfile.complemento;
    this.estabData.cidade      = this.dadosProfile.cidade;
    this.estabData.estado      = this.dadosProfile.estado;
    this.estabData.numero      = this.dadosProfile.numero;
    this.estabData.rua         = this.dadosProfile.rua;
    this.estabData.bairro      = this.dadosProfile.bairro;
    this.estabData.telefone    = this.dadosProfile.telefone;
    this.estabData.telefone2   = this.dadosProfile.telefone2;

    console.log("this.urlImage: ", this.urlImage);
    
    this.estabData.img_url    = this.dadosProfile.img_url;
    this.urlImage             = this.dadosProfile.img_url;
      
    }
    else {
      // Passa aqui ao clicar no botão editar
      this.editField = true;
    }
    
  }


  // Atualização dos dados do perfil
  atualizarDados() {

    if(this.estabData.img_url == undefined) {
      this.estabData.img_url = '';
    }

    this.infoService.postNewEstabData(this.uidCurrentUser, this.estabData).then(() => {
      console.log("Dados atualizados?");
      
      // Após receber URL da imagem, armazenar no Firestore
      this.infoService.atualizaUrlImage(this.uidCurrentUser, this.estabData, this.urlImage).then(() => {
        
        console.log("URL image atualizada com sucesso.");
        
      }) 


    })
    // Fechar campos para edição após salvar.
    this.editField = false;
  }

  


}
