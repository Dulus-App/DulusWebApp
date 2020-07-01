import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { NotificationPopoverComponent } from '../notification-popover/notification-popover.component';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

@Component({
  selector: 'app-header-toolbar-btns',
  templateUrl: './header-toolbar-btns.component.html',
  styleUrls: ['./header-toolbar-btns.component.scss'],
})
export class HeaderToolbarBtnsComponent implements OnInit {

  public imgProfile: string;

  constructor(
              public userService: AuthServiceService,
              public popoverCtrl: PopoverController) { 

  }

  ngOnInit() {

    // Load image
    let userData = this.userService.currentUserAuth;
    this.imgProfile = userData.imgProfileUrl;
    this.imgProfile = "https://firebasestorage.googleapis.com/v0/b/ludus-25201.appspot.com/o/padrao_male.png?alt=media&token=6c60e38b-e891-47a8-9c81-086fc22eb310";
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
