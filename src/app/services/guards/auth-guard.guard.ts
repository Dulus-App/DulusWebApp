import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(
              private router: Router,
              public  afAuth: AngularFireAuth) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User) => {
          if (user) {
            // Usuário logado - Seguir normalmente
            resolve(true);
          } else {
            // Usuário não logado - Redirecionar para paginaa de login
            this.router.navigate(['/auth']);
            resolve(false);
          }
        });
      }); 



   /*   this.afAuth.auth.onAuthStateChanged((user: firebase.User) => {
        if(user) {
          
        }
      })
      
      */
    // return true;
    }
  
}
