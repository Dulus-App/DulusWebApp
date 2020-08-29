import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanaisPageRoutingModule } from './canais-routing.module';

import { CanaisPage } from './canais.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanaisPageRoutingModule
  ],
  declarations: [CanaisPage]
})
export class CanaisPageModule {}
