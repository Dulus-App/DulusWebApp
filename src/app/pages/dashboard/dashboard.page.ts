import { userAuthModel } from './../../models/user.model';

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

// Components
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { NotificationPopoverComponent } from './../../components/notification-popover/notification-popover.component';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public loadData_email: any;

  public user_Obj: any;
  public authCurrent: userAuthModel = new userAuthModel();
  public user_displayName: any; 
  public user_email: any;

  platforms: Array<string>;

  constructor(
              public platform:    Platform,
              public menuCtrl:    MenuController,
              private route:      ActivatedRoute, 
              private router:     Router,
              public afAuth:      AngularFireAuth,
              public userService: AuthServiceService,
              public popoverCtrl: PopoverController) {
    
    this.reloadData();

    
    this.platforms = platform.platforms();

  }

  ionViewWillEnter() {
    console.log("passou no ionViewWillEnter");
    
    // Habilita a exibição do sidemenu.
    this.menuCtrl.enable(true);
   
    
    


  }

 async reloadData() {
    // Objeto completo
    this.authCurrent = this.userService.currentUserAuth;
   
    if(!this.authCurrent.uid){
      this.authCurrent.uid = this.afAuth.auth.currentUser.uid;
    }
  
    if(!this.authCurrent.email) {
      this.authCurrent.email = this.afAuth.auth.currentUser.email;
    }
  
    if(!this.authCurrent.nome) {
      this.authCurrent.nome = this.afAuth.auth.currentUser.displayName;
    }        
    

    if(this.authCurrent != null) {
      console.log("authCurrent logado", this.authCurrent);
      
    }
    else {
      console.log("authCurrent else: ", this.authCurrent);
      
      this.afAuth.auth.onAuthStateChanged((user) => {
        if(user) {
          console.log("usuário logado: ", user);
          // Atribui objeto ao user_Obj
          this.authCurrent.nome = user.displayName;
          this.authCurrent.email = user.email;
          
        }
        else {
          console.log("User não logado");
          
        }
      });
    }
  }

  ngOnInit() { 

/*
    // Objeto completo
    this.authCurrent = this.userService.currentUserAuth;

    this.afAuth.auth.onAuthStateChanged((user) => {
      if(user) {
        console.log("usuário logado: ", user);
        // Atribui objeto ao user_Obj
        this.user_Obj = user;
      }
      else {
        console.log("User não logado");
        
      }
    })*/


    
    
    // Recebendo dados da pagina de login
    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.user_Obj = this.router.getCurrentNavigation().extras.state.userAuth;
      }
    });
    
    // Desestruturação
   // this.user_displayName = this.userService.currentUserAuth
   // this.user_email = this.userService.user_auth.email;
    console.log("currentUser dashboard this.user_Obj: ", this.user_Obj);
  }

  // Exibe Popover do menu
  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      mode: 'ios',
      translucent: true
    });
    return await popover.present();
  }

  // Popover das notificações do usuário
  async notificationsPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationPopoverComponent,
      cssClass: 'notificationPopover',
      event: ev,
      mode: 'ios',
      translucent: true
    });
    return await popover.present();
  }


}
