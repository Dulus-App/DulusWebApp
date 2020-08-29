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
    this.imgProfile = "https://firebasestorage.googleapis.com/v0/b/dulus-82cfb.appspot.com/o/estabelecimentos%2Fpadrao_male.png?alt=media&token=c73e409b-c616-4b15-84e9-a6590414d79e";
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
