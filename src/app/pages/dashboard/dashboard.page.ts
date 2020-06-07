import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
              public menuCtrl: MenuController) { 

  }

  ionViewWillEnter() {
    // Habilita a exibição do sidemenu.
    this.menuCtrl.enable(true);
  }
  ngOnInit() { 
  }

}
