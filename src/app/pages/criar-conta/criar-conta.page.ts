import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

// Firebase
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AlertService } from 'src/app/services/alert/alert.service';

export class currentAuth {
  uid: string;
  displayName: string;
  email: string;
}

export class userLogin {
  email: string;
  password: string;
}

// User Model para enviar os dados a página de cadastro.
export class newUser {
  nome: string;
  email: string;
  celular: string;
}

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {

  @ViewChild('nomeCriar')  nomeCriarInput;
  @ViewChild('emailCriar') emailCriarlInput;
  @ViewChild('cellCriar')  cellCriarInput;

  // Validação dos campos
  public formCriarConta: FormGroup;

  public newUserAuth: newUser = new newUser();
  public userAuth: userLogin = new userLogin();
  //public user_auth: currentAuth = new currentAuth();

  constructor(
              public  navCtrl:     NavController,
              public  menuCtrl:    MenuController,
              public  alertCtrl:   AlertService,
              public  loadingCtrl: LoadingService,
              private storage:     Storage,
              private formBuilder: FormBuilder,
              private router:      Router,
              public  fAuth:       AngularFireAuth) { 

  // Validação dos campos do formulário de criação de conta
  this.formCriarConta = this.formBuilder.group({
    'nome': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    'email': [null, Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
    'celular': [null, Validators.compose([Validators.required, Validators.minLength(11)])]
  });

  }

  ngOnInit() {
    // Desabilita a exibição do sidemenu.
    this.menuCtrl.enable(false);

    // Verificar se usuário está logado
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          // Usuário logado - Redirecionar para dashboard
          this.router.navigate(['/dashboard']);
          resolve(true);
        } else {
          // Usuário não logado
          resolve(false);
        }
      });
    });

  }

  // Cadastro de novo usuário
  newUserEstab() {
    // Enviar dados para proxima tela de cadastro
    let navExtras: NavigationExtras = {state: {userData: this.newUserAuth}}
    // Chamar próxima tela de cadastro
    this.navCtrl.navigateForward(['cadastro'], navExtras);
  }

  createNewUser() {
    
    // Show Loading
    this.loadingCtrl.presentLoadingDefault();

    // Efetua login no Firebase
    this.fAuth.auth.signInWithEmailAndPassword(this.userAuth.email, this.userAuth.password)
      .then((data) => {
        console.log(data);
        let uidCurrentUser = data.user.uid;
        let userData = data.user;

        // Criar sessão do usuário
        firebase.auth() .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            this.storage.set('uid', uidCurrentUser);
            //this.storage.set('userData', userData);
          });

        // Dismiss Loading
        this.loadingCtrl.dismissLoading();

        // Após autenticação envia rota para o Dashboard
        this.navCtrl.navigateRoot('dashboard');
      }, (error) => {
        
        // Dismiss Loading
        this.loadingCtrl.presentLoadingDefault();

        // Trata mensagem de erro em portugues
        let messageError: string;

        switch(error.code){
          case 'auth/wrong-password':
            messageError = "Usuário ou senha incorretos";
            break;
          case 'auth/user-not-found':
            messageError = "Usuário de e-mail não encontrado";
            break;
          case 'auth/invalid-email':
            messageError = "Email com formato errado. Por favor verifique";
            break;
        }

        // Apresenta mensagem de erro no Alert
        this.alertCtrl.showAlertwithMessage("Erro", "Por favor verificar", messageError); 

      }); 
  }


}
