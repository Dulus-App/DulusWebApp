import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './services/guards/auth-guard.guard';
import { DeactivatePageGuard } from './services/guards/deactivate-page.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule),
    
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./pages/cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardGuard],
    
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then( m => m.PostsPageModule),
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'criar-conta',
    loadChildren: () => import('./pages/criar-conta/criar-conta.module').then( m => m.CriarContaPageModule)
  },
  {
    path: 'profile-names',
    loadChildren: () => import('./pages/profile-names/profile-names.module').then( m => m.ProfileNamesPageModule)
  },
  {
    path: 'profile-servicos',
    loadChildren: () => import('./pages/profile-servicos/profile-servicos.module').then( m => m.ProfileServicosPageModule),
    canDeactivate: [DeactivatePageGuard]
  },
  {
    path: 'galeria',
    loadChildren: () => import('./pages/galeria/galeria.module').then( m => m.GaleriaPageModule),

  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'canais',
    loadChildren: () => import('./pages/canais/canais.module').then( m => m.CanaisPageModule)
  },
  {
    path: 'upload-images',
    loadChildren: () => import('./pages/upload-images/upload-images.module').then( m => m.UploadImagesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
