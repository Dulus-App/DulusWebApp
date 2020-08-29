import { async } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database"; 

// Models
import { servicosEstabModel } from 'src/app/models/servicosEstab.model';

// Services
import { AlertService } from 'src/app/services/alert/alert.service';
import { InfoService } from 'src/app/services/info/info.service';
import { IDeactivateComponent } from 'src/app/services/guards/deactivate-page.guard';


@Component({
  selector: 'app-profile-servicos',
  templateUrl: './profile-servicos.page.html',
  styleUrls: ['./profile-servicos.page.scss'],
})
export class ProfileServicosPage implements OnInit, IDeactivateComponent {

  // UID do usuário logado
  public uidCurrentUser: string;

  // Serviços cadastrados
  public myServ: Array<Object> = [];
  public servicos = [];
  public idEditado: string;

  public oneService: Observable<any>;
  
  // Controles Checkbox
  public isCheckedPostagens: boolean;
  public isCheckedAlbuns:    boolean;
  public isCheckedCanal:     boolean;

  public isNewService:  boolean = false;
  public isEditService: boolean = false;
  public openFields:    boolean = false;

  //public authCurrent: userAuthModel = new userAuthModel();
  public newService: servicosEstabModel = new servicosEstabModel();

  constructor(
              private localStorage:   Storage,
              public  alertControler: AlertController,
              public  alertCtrl:      AlertService,
              public  infoService:    InfoService) { 
   
   
  }


  // Verifica saida da página
canExit() : boolean {

  /*
 
  let res: string;
  // Verifica se está em modo de edição
  if(this.isNewService) {

    // Exibe alerta com botões de opção para prosseguir
  this.alertLeavePage().then((response) => {
      res = response
   });

   if (res === 'true') {

     return true;
   }
   else {
     return false;
   }

  }
  */


  


/*
 let response: string;
    // Verifica se está em modo de edição
    if(this.isNewService) {
      // Exibe alerta pergundanto se deseja realmente sair
    this.alertCtrl.showAlertLeavePage("Atenção !", "", "Deseja realmente sair antes de salvar os dados?").then((data: string) => {

        console.log("Retorno do alert para sair de pagina", data);
        response = data;
      
      // Verifica resposta do alert
      if(response === 'true') {
        return true;
      }
        else {
          return false;
      }

      });
    }
      else {
      return true;
    }
    */
   
  

    if(this.isNewService) {
      if (confirm("Deseja realmente sair antes de salvar os dados?")) {
        return true;
      } else {
        return false;
      }

    }
    else {
      return true;
    }

}

  async alertLeavePage() {

    let retorno: string;
  

    const alert = await this.alertControler.create({
      cssClass: 'my-custom-class',
      header: 'Atenção !',
      message: 'Deseja realmente sair antes de salvar os dados?',
      buttons: [
        {
          text: 'Não',
          role: 'false',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Sim',
          role: 'true',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();

    // Retornando o valor escolhido.
    await alert.onDidDismiss().then((data) => {
      retorno = data.role;
    });
    console.log("retorno do alert service: ", retorno);
    
    return retorno;

    
  }

  ngOnInit() {

    // Busca o UID do usuário logado
    this.localStorage.get('uid').then(data => {
      this.uidCurrentUser = data;

      // Busca todos os serviços cadastrados
      this.getServices();
    });
  }

 
  saveNewService() {

      // Verificação dos checkboxes 
      if(!this.newService.postagens) {
        this.newService.postagens = false;
      }

      if(!this.newService.albuns) {
        this.newService.albuns = false;
      }

      if(!this.newService.canal) {
        this.newService.canal = false;
      }


    // Verifica qual serviço utilizar
    if(this.isEditService) {

      // Realiza rotina de edição
    this.editById(this.idEditado);

    }

    else {


      // Cria um novo serviço
      this.infoService.postNewService(this.uidCurrentUser, this.newService).then((data: any) => {
        
        this.myServ = data;
        // Carrega os serviços cadastrados
        this.getServices();
  
        // Limpar campos
        this.limparCampos();
  
        // Desabilitar inputs
        this.isNewService = false;
  
  
      }, (erro) => {
        console.log(erro);
        
      });

    }

  }
  
  // Busca todos os serviços cadastrados
 getServices() {
  
  let dados = [];
  this.myServ = [];
  dados = [];
  
  this.infoService.getAllService(this.uidCurrentUser).subscribe(res => {
    res.forEach((item: any) => {
      dados.push({key: item.payload.doc.id, ...item.payload.doc.data() })
      
    })
  })
  
  // Atribui dados 
  this.myServ = dados; 
  console.log("myServ: ", this.myServ);
  
  }


 editService(editServicoId: any) {

  // Controle de exibição dos botões
  this.isEditService = true;
  this.isNewService = false;

  // Habilita campos para edição
  this.openFields = true;
   
  this.idEditado = editServicoId;

  console.log(editServicoId);
  
  
  this.infoService.getServiceById(this.uidCurrentUser, editServicoId).subscribe((data: any) => {
    this.newService.nomeServico  = data.nomeServico;
    this.newService.descServico  = data.descServico;
    this.newService.periodo      = data.periodo;
    this.newService.valorServico = data.valorServico;
    this.newService.postagens    = data.postagens;
    this.newService.albuns       = data.albuns;
    this.newService.canal        = data.canal;
    console.log(data);
  
  })

}

 editById(id: string) {

  console.log("antes de salvar: ", this.newService);
  

    this.infoService.editServiceById(this.uidCurrentUser, id, this.newService).then(data => {
      console.log("Dados atualizados com sucesso");
      
      // Limpa campos
      this.limparCampos();
  
      // Fecha o modo de edição.
      this.isEditService = false;
  
      // Carregar os serviços novamente
      this.getServices();
    });
  }

  novoServico() {
    this.isNewService = true;
    this.isEditService = false;

    // Habilita campos
    this.openFields = true;
  }

  cancelarNovoServico() {
    this.isNewService = false;

    this.isEditService = false;

    // Fecha campos para edição
    this.openFields = false;

    // Limpar campos
    this.limparCampos();
  }

  deleteService(deleteServicoId: any) {


    this.alertCtrl.showAlertWithMessageAndButton("Deletar", "", "Deseja realmente deletar este item?" ).then(response => {
      
      if(response == 'ok') {
        console.log("response: ", response);
        
        // Prosseguir com a deleção do item
        this.infoService.deleteItemService(this.uidCurrentUser, deleteServicoId).then(data => {
          
          // Limpar campos
          

          // Carregar os serviços novamente
          this.getServices();

          console.log("Deletado com sucesso: ", data);
          
        },(erro) => {
          console.log("Erro ao deletear: ", erro);
          
        });
      }
      else {

        // Não fazer nada.
      }
      console.log(response);
      
    })

    console.log("Nome do serviço para deletar: ", deleteServicoId);
  }


  // Verifica mudança no segment
  segmentChangedProfile(event) {
    console.log(event);
    
  }

  // Btn para criar novo serviço
  criarNovoServico() {

    this.isNewService = true;

    // Habilita campos para preenchimento
    this.openFields = true;
  }

  editarServico() {
    this.isNewService = false;
    // Detalhes da página

    // Habilita campos
    this.openFields = true;
  }


  // Controle de checkbox - Links relacionados
  showPostagens() {
    this.isCheckedPostagens = this.newService.postagens;
    console.log("isCheckedPostagens: ", this.isCheckedPostagens);
    
  }

  showAlbum() {
    this.isCheckedAlbuns = this.newService.albuns;
    console.log("isCheckedAlbuns: ", this.isCheckedAlbuns);
    
    
  }

  showCanal() {
    this.isCheckedCanal = this.newService.canal;
    console.log("isCheckedCanal: ", this.isCheckedCanal);
    
    
  }

  // Limpar campos
  limparCampos() {

    this.newService.nomeServico  = null;
    this.newService.descServico  = null;
    this.newService.periodo      = null;
    this.newService.valorServico = null;
    this.newService.postagens    = false;
    this.newService.albuns       = false;
    this.newService.canal        = false;
  }

}
