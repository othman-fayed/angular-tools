import { Routes } from '@angular/router';
import { MenuBuilderPage } from './pages/menu-builder/menu-builder.page';

export const routes: Routes = [
  { path: 'menu-builder', component: MenuBuilderPage },
  { path: '', redirectTo: '/menu-builder', pathMatch: 'full' }
];
