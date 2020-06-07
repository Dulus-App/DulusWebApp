import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Services
import { AlertService } from './../../services/alert/alert.service';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';

// Model 
export class UserReset {
  email: string;
}


@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  // Instância do objeto para reset
  public userReset: UserReset = new UserReset();

  constructor(
              public navCtrl:   NavController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertService,
              public afAuth:    AngularFireAuth) { 

  }

  ngOnInit() {
  }

  resetUserPassword() {

    // Envia e-mail para usuário cadastrado.
    this.afAuth.auth.sendPasswordResetEmail(this.userReset.email)
      .then((data) => {

        // Dismiss modal
        this.modalCtrl.dismiss();

        // Envia mensagem de confirmação
        this.alertCtrl.showAlertwithMessage("Confirmado", "Tudo certo", "Um e-mail foi enviado para prosseguir com a recuperação de sua senha.")      

        
      }, (error) => {
        
        // Variavel que será passada para o alerta.
        let msg: string;
        
        // Tratamento da mensagem de retorno
        switch(error.code) {
       
          case 'auth/user-not-found':
            msg = "E-mail não encontrado em nossa base de dados. Por favor verifique.";
            break;

          case 'auth/invalid-email':
            msg = 'E-mail mal inválido.';
            break;

          case 'auth/argument-error':
            msg = 'E-mail mal inválido.';
            break;

          }

          // Exibe mensagem de erro.
          this.alertCtrl.showAlertwithMessage("Erro", "Verifique para prosseguir", msg);

      });
  }
  
}
