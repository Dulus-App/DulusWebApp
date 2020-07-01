import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userAuthModel } from 'src/app/models/user.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  // Dados com o usuário logado
  public currentUserAuth: userAuthModel = new userAuthModel();
  public user_auth: any;
  
  constructor(
              private storage: Storage,
              public  afAuth:  AngularFireAuth) { 

  }

  // Efetua logout do usuário no firebase
  async logoutFirebase() {

   await this.afAuth.auth.signOut().then(data => {
      console.log('Dados do logout: ', data);

      this.storage.remove('uid');
    }, (erro) => {
      console.error(erro);
    });
  }

  // Realiza o login do usuário no Firebase
async loginFirebase(email, senha) {
   await this.afAuth.auth.signInWithEmailAndPassword(email, senha)
      .then((data) => {
        console.log(data);
        // Teste no console das informações passadas --- Deletar
        console.log(data.user.uid);
        console.log(data.user.email);
        console.log(data.user.displayName);

        this.currentUserAuth.nome          = data.user.displayName;
        this.currentUserAuth.email         = data.user.email;
        this.currentUserAuth.uid           = data.user.uid;
        this.currentUserAuth.imgProfileUrl = data.user.photoURL;
        
      });
      return this.currentUserAuth;
  }

  async loginCustomToken() {
    
  }
}
