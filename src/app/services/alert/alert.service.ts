import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})


export class AlertService {

  public retorno: any; 

  constructor(
              public alertController: AlertController) { 

  }

  // Exibe alerta padrão
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      subHeader: 'Subtítulo',
      message: 'Está é uma mensagem de alerta.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Exibe alerta padrão com mensagem customizada
  async showAlertwithMessage(header, subHeader, messsage) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: messsage,
      buttons: ['OK']
    });

    await alert.present();
  }


  // Exibe alerta com botões de opção para prosseguir
  async showAlertWithMessageAndButton(header, subheader, message) {
    
    
    const alertBtn = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
             // this.retorno = 'cancel';
          }
        }, {
          text: 'SIM',
          role: 'ok',
          handler: (ok) => {
            
           // this.retorno = 'ok';
          }
        }
      ]
    });

    await alertBtn.present();
    // Retornando o valor escolhido.
    await alertBtn.onDidDismiss().then((data) => {
      this.retorno = data.role;
    });
    
    return this.retorno;
  }

}
