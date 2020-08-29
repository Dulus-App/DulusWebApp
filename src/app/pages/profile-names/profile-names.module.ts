import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileNamesPageRoutingModule } from './profile-names-routing.module';

import { ProfileNamesPage } from './profile-names.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileNamesPageRoutingModule
  ],
  declarations: [ProfileNamesPage]
})
export class ProfileNamesPageModule {}
