import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {


  loader:HTMLIonLoadingElement;
  constructor(
              public loadingCtrl: LoadingController) { 

  }

  // Apresentação do loading padrão
  async presentLoadingDefault() {
    this.loader = await this.loadingCtrl.create({
      message: 'Por favor aguarde...'
    });
  
   await this.loader.present().then(() => {
     console.log("loading...");
   });
  
  }


  // Método que realiza o encerramento do loading.
  async dismissLoading() {
    await this.loader.dismiss()
    .then(()=>{
      this.loader = null;
    })
    .catch(e => console.log(e));
  
   
    //return this.loader.dismiss();
    /* return new Promise((resolve, reject) => {
      if(this.loader) {
        return this.loader.dismiss(resolve(true)).catch(error => {
          console.log('Loading erro: ', error);
        });
      }else {
        resolve(true);
      }
    });*/
  }


  // Loading com mensagem customizada
  async showLoadingWithMessage(message) {

    const loadingMessage = await this.loadingCtrl.create({
      message: message,
      duration: 5000
    });

    await loadingMessage.present().then(() => {
      console.log("loadingMessage");
    });
  }

  // Loading com mensagem customizada e botão de confirmação


}
