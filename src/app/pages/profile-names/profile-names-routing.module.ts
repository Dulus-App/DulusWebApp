import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileNamesPage } from './profile-names.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileNamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileNamesPageRoutingModule {}
