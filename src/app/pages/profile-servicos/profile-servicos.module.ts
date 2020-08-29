import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileServicosPageRoutingModule } from './profile-servicos-routing.module';

import { ProfileServicosPage } from './profile-servicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileServicosPageRoutingModule
  ],
  declarations: [ProfileServicosPage]
})
export class ProfileServicosPageModule {}
