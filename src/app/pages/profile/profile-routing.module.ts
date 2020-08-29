import { ResetPage } from './../reset/reset.page';
import { FolderPage } from './../../folder/folder.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { ProfileNamesPage } from '../profile-names/profile-names.page';
import { ProfileServicosPage } from '../profile-servicos/profile-servicos.page';
import { DeactivatePageGuard } from 'src/app/services/guards/deactivate-page.guard';

const routes: Routes = [
   {
    path: '',
    component: ProfilePage,
    loadChildren: () => import('../profile-names/profile-names.module').then(m => m.ProfileNamesPageModule),
  
    children: [
      {
        path: 'profile-names',
        component: ProfileNamesPage,
        loadChildren: () => import('../profile-names/profile-names.module').then(m => m.ProfileNamesPageModule),
        pathMatch: 'full',
      },
      {
        path: 'profile-servicos',
        component: ProfileServicosPage,
        canDeactivate: [DeactivatePageGuard],
        loadChildren: () => import('../profile-servicos/profile-servicos.module').then(m => m.ProfileServicosPageModule),
        pathMatch: 'full'
      },
      { 
        path: '',
        redirectTo: 'profile-names'
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
