import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageOption, SideMenuConfig } from '../../models/page-option.interface';

@Component({
  selector: 'app-dynamic-sidemenu',
  imports: [CommonModule, RouterModule],
  templateUrl: './dynamic-sidemenu.html',
  styleUrl: './dynamic-sidemenu.scss'
})
export class DynamicSidemenu {
  @Input() config: SideMenuConfig = { pages: [] };
  @Output() pageSelected = new EventEmitter<PageOption>();
  @Output() menuToggled = new EventEmitter<boolean>();

  toggleSubmenu(page: PageOption): void {
    if (page.children && page.children.length > 0) {
      page.isExpanded = !page.isExpanded;
    }
  }

  selectPage(page: PageOption): void {
    if (!page.children || page.children.length === 0) {
      this.pageSelected.emit(page);
    }
  }

  toggleMenu(): void {
    if (this.config.collapsible) {
      this.config.collapsed = !this.config.collapsed;
      this.menuToggled.emit(this.config.collapsed);
    }
  }

  trackByPageId(index: number, page: PageOption): string {
    return page.id;
  }
}
