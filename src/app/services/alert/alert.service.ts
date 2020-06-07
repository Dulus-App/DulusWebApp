import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})


export class AlertService {

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

}
