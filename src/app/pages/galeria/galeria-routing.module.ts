import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GaleriaPage } from './galeria.page';
import { DeactivatePageGuard } from 'src/app/services/guards/deactivate-page.guard';

const routes: Routes = [
  {
    path: '',
    component: GaleriaPage,
    canDeactivate: [DeactivatePageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GaleriaPageRoutingModule {}
