import { Component, OnInit, ViewChild } from '@angular/core';
import { MyComponentsModule } from './../../components/components.module';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { userAuthModel } from 'src/app/models/user.model';
import { IonTabs } from '@ionic/angular';
import { InfoService } from 'src/app/services/info/info.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

 // @ViewChild('tabProfile')

  
  public userData: userAuthModel = new userAuthModel();
  
  constructor(
              public infoService: InfoService,
              public userService: AuthServiceService) { 

  }

  ngOnInit() {

  
    

    this.userData = this.userService.currentUserAuth;
    console.log(this.userData);
  }


  

}
