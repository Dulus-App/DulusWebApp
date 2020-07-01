import { Component, OnInit } from '@angular/core';
import { MyComponentsModule } from './../../components/components.module';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { userAuthModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userData: userAuthModel = new userAuthModel();
  
  constructor(
              public userService: AuthServiceService) { 

  }

  ngOnInit() {

    this.userData = this.userService.currentUserAuth;
    console.log(this.userData);
  }

}
