import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileServicosPage } from './profile-servicos.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileServicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileServicosPageRoutingModule {}
