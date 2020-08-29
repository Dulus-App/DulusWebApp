import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadImagesPageRoutingModule } from './upload-images-routing.module';

import { UploadImagesPage } from './upload-images.page';
import { MyComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    MyComponentsModule,
    FormsModule,
    IonicModule,
    UploadImagesPageRoutingModule
  ],
  declarations: [UploadImagesPage]
})
export class UploadImagesPageModule {}
