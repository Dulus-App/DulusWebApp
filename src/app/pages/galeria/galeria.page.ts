import { NavController, MenuController } from '@ionic/angular';
import { ToastControllerService } from './../../services/toastController/toast-controller.service';
import { Component, OnInit } from '@angular/core';

import { MyComponentsModule } from './../../components/components.module';

import { newAlbumData } from '../../models/albumData.model';
import { GaleriaService } from 'src/app/services/galeria/galeria.service';
import { Storage } from '@ionic/storage';

// Validação dos formulários
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { IDeactivateComponent } from 'src/app/services/guards/deactivate-page.guard';




@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit, IDeactivateComponent {

  // UID do usuário logado
  public uidCurrentUser: string;

  public isNewAlbum: boolean = false;
  public isEditAlbum: boolean = false;
  public isNewUploadImg: boolean = false;
  public newAlbum: newAlbumData = new newAlbumData();
  public galerias: any = [];
  public imagesAlbumById: Array<any> = [];
  public imagesAlbumById_aux: Array<any> = [];

  public editedAlbum: newAlbumData = new newAlbumData();

  public refImageCapa: FileList;
  public refImageAlbum: FileList;

  public disabled: boolean = false;

  public spinner: boolean = false;
   // Validação do formulário
   public formNewAlbum: FormGroup;

  constructor(
              public  alertCtrl:     AlertService,
              public  loadingCtrl:   LoadingService,
              public  navCtrl:       NavController,
              public  menuCtrl:      MenuController,
              public  toastCtrl:     ToastControllerService,
              private localStorage:  Storage,
              private formBuilder:   FormBuilder,
              public  galeryService: GaleriaService) { 


  this.formNewAlbum = this.formBuilder.group({
    'nomeAlbum': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    'descAlbum': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    'capa'     : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
  });

  }

  // Verifica saida da página
  canExit() : boolean {
    if(this.isNewAlbum) {
     
     /* this.alertCtrl.showAlertWithMessageAndButtonAtLeavePage("Atenção !", "", "Deseja salvar os dados ao sair?").then(res => {
        if(res == 'ok') {
          // Salvar os dados


        }
        else {
          // Não salvar e sair
          return true;
        }
      }) */


      // Método que funciona
      if (confirm("Deseja salvar os dados ao sair?")) {
        
        console.log("ok");
        
        // Verificar se está salvando ou editando
        if(this.isEditAlbum) {

          // Ao estar editando um álbum

          console.log("Criando album - this.isNewAlbum: ", this.isNewAlbum);
          console.log("this.isEditAlbum: ", this.isEditAlbum);
          
          try {
            this.editAlbumData();
            this.toastCtrl.presentToast("Dados salvos com sucesso");

          } catch (error) {
            console.log("error: ", error);
            
          }



          return true;

        }
        else {

          // Ao criar um novo álbum
          console.log("Criando album - this.isNewAlbum: ", this.isNewAlbum);
          console.log("this.isEditAlbum: ", this.isEditAlbum);

          // Tentar criar um novo álbum
          try {
            
            if(this.formNewAlbum.valid) {
              
              this.saveNewAlbum();
              this.toastCtrl.presentToast("Dados salvos com sucesso");
              console.log("formNewAlbum.valid: ", this.formNewAlbum.valid);
            }
            else {
              console.log("não valido");
              
              console.log("formNewAlbum.valid: ", this.formNewAlbum.valid);
              this.toastCtrl.presentToastErro("Dados incompletos não foram salvos");
            }
            
            //this.saveNewAlbum();

          } catch (error) {
            
          }

          return true;
        }

        


        // Mensagem de confirmação
        //this.toastCtrl.presentToast()

        

      } else {
        
        console.log("nao");
        
        return true;
      } 

    }
    else {
      return true;
    }
  }

  ngOnInit() {

    // Busca o UID do usuário logado
    this.localStorage.get('uid').then(data => {
      this.uidCurrentUser = data;

      this.listAllAlbuns();
    });

  }

  

  /**
   *  CONTROLES DE PÁGINA
   */

  // Criar um novo album
  newAlbumPage() {
    this.isNewAlbum = true;

    // Bloquear edição de album já criado
    for(var i = 0; i < this.galerias.length; i++) {
      this.galerias[i].disabled = true;  
    }
  }
  
  // Cancelar novo album
  cancelNewAlbum() {
    // Fecha edição e exibição do card de criação
    this.isNewAlbum = false;
    this.isEditAlbum = false;
    
    for(var i = 0; i < this.galerias.length; i++) {
      this.galerias[i].disabled = false;  
    }


    this.limparCamposForm();
  }

  limparCamposForm() {
    // Limpar campos do formulário
    this.newAlbum.nomeAlbum = null;
    this.newAlbum.descAlbum = null;
    this.newAlbum.capa      = null; 

    // Limpar atribuição de novo upload
    this.isNewUploadImg = false;
  }

  // Apresentação do toast
 /* async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'my-custom-class',
      //color: 'primary',
      position: 'bottom',
      message: msg,
      duration: 4000
    });
    toast.present();
  } */



  /**
   *  UPLOAD DE IMAGENS
   * 
   */


  // Upload da Capa do album
  uploadFileCapa(event) {
    let fileName
    this.refImageCapa = event;
    

    // Atribui filename ao input correspondente na tela
    for(var i = 0; i < this.refImageCapa.length; i++) {
      fileName = this.refImageCapa.item(i).name;
    }

    this.newAlbum.capa = fileName;

    // Regitra alteração de capa
    this.isNewUploadImg = true;
    console.log("this.isNewUploadImg: ", this.isNewUploadImg);
    
  }


async uploadFileAlbumItem(event: FileList) {
    
  this.spinner = true;
    
    this.refImageAlbum = event;
    
    while (this.imagesAlbumById.length) {
      this.imagesAlbumById.pop();
    }
    
    // Show loading
    this.loadingCtrl.showLoadingWithMessage("Carregando imagem...");
       
    // Fazer upload das imagens do album
 await this.galeryService.uploadImageAlbum(this.uidCurrentUser, this.editedAlbum.albumId, this.refImageAlbum)
  .then((data: any) => {
    
    this.imagesAlbumById = data;
    this.imagesAlbumById.reverse();

    this.loadingCtrl.dismissLoading();
    this.spinner = false;
  });
    

  }


  /**
   * SALVANDO INFORMAÇÕES
   */

  // Salvamento completo das informações
  saveNewAlbum() {

    // Salvar a criação da galeria no Realtime Daabase
    this.galeryService.createNewAlbum(this.uidCurrentUser, this.newAlbum).then((data) => {

      console.log("data apos salvar: ", data);
      
      // Fazer upload da capa
      this.galeryService.uploadImages(this.uidCurrentUser,this.refImageCapa)

      

      this.limparCamposForm();
      this.isNewAlbum = false;
      this.isNewUploadImg = false;
      //this.uploadFile
    })
  }



  /**
   * LISTANDO INFORMAÇÕES
   */

  listAllAlbuns() {

   // let galeriaItem = [];
    this.galeryService.listAllAlbuns(this.uidCurrentUser).subscribe(res => {
      this.galerias = res.reverse();
     /* res.reverse;
      res.forEach((itens: any) => {
        
        
        galeriaItem.push({key: itens.payload.key, ...itens.payload.val() })
      })
      
      this.galerias = galeriaItem;*/
      
      console.log(this.galerias);
      
    });
    
  }

  loadAllImagesAlbum(albumById: any) {
    
    this.galeryService.getAllImagesAlbum(this.uidCurrentUser, albumById).subscribe(res => {
      this.imagesAlbumById = res.reverse();
    });
    
  }

  // Busca informações e imagens ao clicar sobre a galeria
  async editAlbum(galeriaItem: any, index: number) {
    console.log(galeriaItem);
    
   // let imagensGaleria = [];
    this.editedAlbum = galeriaItem;

    this.isEditAlbum = true;
    this.isNewAlbum = true;

    // Index do item clicado
    //this.disabled = galeriaItem.albumId;
    for(var i = 0; i < this.galerias.length; i++) {
      if(i != index) {
        this.galerias[i].disabled = true;
      }
    }

    // Atribuição dos campos na tela
    this.newAlbum.nomeAlbum = galeriaItem.nomeAlbum;
    this.newAlbum.descAlbum = galeriaItem.descAlbum;
    this.newAlbum.capa      = galeriaItem.urlImage;

    

    this.galeryService.getImagesAlbum(this.uidCurrentUser, this.editedAlbum.albumId)
    .then((result: Array<any>) => {
     
      this.imagesAlbumById = result.reverse();
      console.log("result: ", result);
      
    });
   /*.then(data => {
     this.imagesAlbumById = data;
   }) */

    
   


    console.log(this.imagesAlbumById);
    
    
    
   // .subscribe(res => { // Funciona atualmente
      
    //  this.imagesAlbumById = res.reverse(); 


    /*  res.reverse();
      res.forEach((itens: any) => {
        this.imagesAlbumById.push({key: itens.payload.key, ...itens.payload.val() })
      }) */
      
    
  //  .then((data) => {
    //  this.imagesAlbumById = data;
     // console.log("this.imagesAlbumById: ", this.imagesAlbumById);
   // }) 
    
   /* .subscribe(res => {
     // this.imagesAlbumById = res.reverse();
          res.reverse();
      res.forEach((itens: any) => {
        this.imagesAlbumById.push({key: itens.payload.key, ...itens.payload.val() })
      }) */      
      
      //this.imagesAlbumById = imagensGaleria; 
      
      
 //   });  // Funciona atualmente

  }
  

  // Editar os dados de um album
  editAlbumData() {

    //this.galeryService.editAlbumGalery(this.uidCurrentUser, this.editedAlbum.albumId, this.newAlbum).then(() => {
    this.galeryService.editAlbumGalery(this.uidCurrentUser, this.editedAlbum, this.newAlbum).then(() => {
  
      // Limpar campos e fechar edição de formulário
      //this.limparCamposForm();
      //this.isEditAlbum = false;
      //this.cancelNewAlbum();

      // Verificar se houve alteração da capa
      if(this.isNewUploadImg == true) {
       /* console.log("caiu no if");
        console.log("this.newAlbum.capa: ", this.newAlbum.capa);
        console.log("this.editedAlbum.capa: ", this.editedAlbum.capa);*/
        
        
        // Atualiza imagem da Capa
        this.galeryService.modificaCapaAntiga(this.uidCurrentUser, this.refImageCapa, this.editedAlbum).then(() => {
          this.isEditAlbum = false;
          this.isNewAlbum = false;
          this.limparCamposForm();
        })
        

        
        
      }
      else {
        // Hábilitar campos
        let index: number;
        for(var i = 0; i < this.galerias.length; i++) {
          if(i != index) {
            this.galerias[i].disabled = false;
          }
        }
        // Fechar edição
        this.isEditAlbum = false;
        this.isNewAlbum = false;
        // Limpar campos
        this.limparCamposForm();
      }

    }, (err) => {
      console.log(err);
      
    });

  }



  /**
   * DELETANTO INFORMAÇÕES
   */

  deleteImgFromAlbum(path: string, albumById: any) {

    // Verificar autorização antes de deletar imagem do album
    this.alertCtrl.showAlertWithMessageAndButton("Deletar", "", "Deseja realmente deletar a imagem ?").then(res => {

      if(res === 'ok') {

        while (this.imagesAlbumById.length) {
          this.imagesAlbumById.pop();
        }


        this.galeryService.deleteImagesFromAlbum(this.uidCurrentUser, path).then((data) => {
          console.log("Imagem deletada com sucesso", data);
          
          // Após deletar a imagem, remover a referencia no Realtime Database
          this.galeryService.deleteRefAlbumDatabase(this.uidCurrentUser, albumById).then((data) => {
            console.log(data);
            //this.listAllAlbuns();
            
            //this.imagesAlbumById.reverse();
            this.galeryService.getImagesAlbum(this.uidCurrentUser, this.editedAlbum.albumId)
            .then((res: Array<any>) => {
              
              this.imagesAlbumById = res;
              this.imagesAlbumById.reverse();
              
              // Confirmação de imagem deletada
              this.toastCtrl.presentToast("Imagem deletada com sucesso.");

            })

          }, (err) => {
            console.log(err);
            
          })
    
        }, (err) => {
          console.log(err);
          
        });






      }
      else {
        // Do nothing
      }
    })


  }


  // Deletar album da galeria
  deleteAlbumGalery(imagesById: any) {
    console.log(imagesById);
    
    // Verificar se há imagens no album
    let countRef = this.imagesAlbumById.length;
    console.log("countRef", countRef);
    
    // Permitir somente se não houver imagem no album
    if(countRef <= 0) {
      
      // Verificar a permissão antes de deletar
      this.alertCtrl.showAlertWithMessageAndButton("Deletar", "", "Deseja realmente deletar este álbum?").then((response) => {

        if(response == 'ok') {

          // Show loading
          this.loadingCtrl.showLoadingWithMessage("Aguarde...");

          // Prosseguir com processo de exclusão do album
          this.galeryService.deleteGaleryAlbum(this.uidCurrentUser, imagesById)
          
          // Fechar edição de campos
          this.isNewAlbum = false;
          this.isEditAlbum = false;
          this.limparCamposForm();
          this.loadingCtrl.dismissLoading();
        }
        else {
          // Do nothing

        }
      })
      

    }
    else {
      // Não permitodo deletar os dados
      this.alertCtrl.showAlertwithMessage("Atenção !", "Não é possível deletar", `O album contem ${countRef} imagens`);
    }

  }

}
