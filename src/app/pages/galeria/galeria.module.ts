import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GaleriaPageRoutingModule } from './galeria-routing.module';
import { MyComponentsModule } from './../../components/components.module';

import { GaleriaPage } from './galeria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MyComponentsModule,
    IonicModule,
    ReactiveFormsModule,
    GaleriaPageRoutingModule
  ],
  declarations: [GaleriaPage]
})
export class GaleriaPageModule {}
