import { Routes } from '@angular/router';
import { MenuBuilderPage } from './pages/menu-builder/menu-builder.page';
import { RazorEditorPage } from './pages/razor-editor/razor-editor.page';

export const routes: Routes = [
  { path: 'menu-builder', component: MenuBuilderPage },
  { path: 'razor-editor', component: RazorEditorPage },
  { path: '', redirectTo: '/menu-builder', pathMatch: 'full' }
];
