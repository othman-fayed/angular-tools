import { Routes } from '@angular/router';
import { MenuBuilderPage } from './pages/menu-builder/menu-builder.page';
import { RazorEditorPage } from './pages/razor-editor/razor-editor.page';
import { SequenceDesignerPage } from './pages/sequence-designer/sequence-designer.page';

export const routes: Routes = [
  { path: 'menu-builder', component: MenuBuilderPage },
  { path: 'razor-editor', component: RazorEditorPage },
  { path: 'sequence-designer', component: SequenceDesignerPage },
  { path: '', redirectTo: '/menu-builder', pathMatch: 'full' }
];
