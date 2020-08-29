import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastControllerService {

  constructor(
              public toastController: ToastController ) { 

  }

  async presentToast(msg: string) {

    const toast = await this.toastController.create({
      cssClass: 'my-custom-class',
      position: 'bottom',
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  async presentToastErro(msg: string) {

    const toast = await this.toastController.create({
      cssClass: 'my-custom-class_erro',
      position: 'bottom',
      message: msg,
      duration: 4000
    });
    toast.present();
  }


}
