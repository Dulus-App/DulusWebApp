import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { ResetPage } from './reset.page';
import { AuthPage } from './../auth/auth.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPage
  },
  {
    path: 'auth',
    component: AuthPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPageRoutingModule {}
