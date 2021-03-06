import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, IonSlides, NavController, ModalController, LoadingController } from '@ionic/angular';

// Services
import { LoadingService } from '../../services/loading/loading.service';
import { AlertService } from '../../services/alert/alert.service';

// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

// Pages
import { ResetPage } from '../reset/reset.page';
import { NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
 
export class currentAuth {
  uid: string;
  displayName: string;
  email: string;
}
// User Model para efetuar o login no firebase auth.
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
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  
  // Validação dos campos
  public formCriarConta: FormGroup;

  // Declaração dos slides.
  @ViewChild(IonSlides) slides: IonSlides;

  // Controle de campos com Tabs
  @ViewChild('email')      emailInput;
  @ViewChild('nomeCriar')  nomeCriarInput;
  @ViewChild('emailCriar') emailCriarlInput;
  @ViewChild('cellCriar')  cellCriarInput;
  @ViewChild('btnCriar')   btnCriar;

  // Objetos para armazenas os dados de login e criação de conta dos usuários
  public userAuth: userLogin = new userLogin();
  public newUserAuth: newUser = new newUser();
  public user_auth: currentAuth = new currentAuth();
  

  constructor(
              public  navCtrl:     NavController,
              public  menuCtrl:    MenuController,
              public  modalCtrl:   ModalController,
              private formBuilder: FormBuilder,
              public  alertCtrl:   AlertService,
              public  loadingCtrl: LoadingService,
              private storage:     Storage,
              private router:      Router,
              public  userService: AuthServiceService,
              public  fAuth:       AngularFireAuth) { 


  // Validação dos campos do formulário de criação de conta
  this.formCriarConta = this.formBuilder.group({
    'nome': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    'email': [null, Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
    'celular': [null, Validators.compose([Validators.required, Validators.minLength(11)])]
  });

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);

    
  }
  
  ionViewDidEnter() {
    this.storage.get('uid').then((data => {
      if(data) {
        this.navCtrl.navigateRoot('dashboard');
      }
      else {
        // Não há usuário logado
      }
      console.log(data);
    }))
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

  // Verifica Tabs e modifica o foco.
  blurBtn() {
    this.emailInput.setFocus();
  }

  // Retorna foco ao campo ao sair do input Celular
  blurCell() {
    this.nomeCriarInput.setFocus();
  }


  // Controle de navegação entre abas (Login & Criar conta)
  segmentChanged(event: any){
    console.log(event.detail.value);
    if(event.detail.value === "segmentSignin"){
      this.slides.slidePrev();
    }else {
      this.slides.slideNext();
    }
  }


  // Reset de senha
  async handleResetPass() {
    console.log("reset de senha");
    // Show modal
    const modal = await this.modalCtrl.create({
      component: ResetPage,
    });
    return await modal.present();

  }


  // Cadastro de novo usuário
  newUserEstab() {
    // Enviar dados para proxima tela de cadastro
    let navExtras: NavigationExtras = {state: {userData: this.newUserAuth}}
    // Chamar próxima tela de cadastro
    this.navCtrl.navigateForward(['cadastro'], navExtras);
  }

 async handleLoginService() {

   // Show Loading
    this.loadingCtrl.presentLoadingDefault();
   
   await this.userService.loginFirebase(this.userAuth.email, this.userAuth.password)
   .then((data) => {
     
        // Criar sessão do usuário
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            // Limpa dados do usuário no navegador.
            this.storage.set('uid', data.uid);
          });

        // Dismiss Loading
        this.loadingCtrl.dismissLoading();


        // Enviar dados para proxima tela de cadastro
        let navExtrasAuth: NavigationExtras = {state: {userAuth: this.user_auth}}


        // Após autenticação envia rota para o Dashboard
        this.navCtrl.navigateRoot(['dashboard'], navExtrasAuth);
      }, (error) => {      
       
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

        // Dismiss Loading
        this.loadingCtrl.dismissLoading();

        console.log(error);
        // Apresenta mensagem de erro no Alert
        this.alertCtrl.showAlertwithMessage("Erro", "Por favor verificar", messageError); 

      })
  }


  // Funçaõ do botão de criar nova conta
  handleNewUserService() {

    this.navCtrl.navigateForward('/criar-conta');

    /*
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

      }); */
  }

  

}
