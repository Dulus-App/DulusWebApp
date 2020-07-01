import { PopoverController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

// Services
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
              public alertCtrl: AlertService,
              public navCtrl:   NavController,
              public popOver:   PopoverController,
              public afService: AuthServiceService) { 

  }

  ngOnInit() {}

 async logOut() {

    // Fecha o popover
    this.popOver.dismiss();

    // Exibe mensagem para verificar se efetua logout
  await this.alertCtrl.showAlertWithMessageAndButton("Sair", "", "Deseja realmente sair?")
    .then((res) => {
      
      // Sim, deve efetuar o logout
      if(res == 'ok'){
        console.log('res == ok');

        // Realiza logout no firebase
        this.afService.logoutFirebase();

        // Envia para página de login
        this.navCtrl.navigateRoot('auth');
      } 
      // Cancelar, não fazer nada.
      else{
        console.log('res == cancel');
      }

    });
   



    
    
  }

}
