import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageOption, SideMenuConfig } from '../../models/page-option.interface';
import { DynamicSidemenu } from '../dynamic-sidemenu/dynamic-sidemenu';

@Component({
  selector: 'app-dynamic-sidemenu-builder',
  imports: [CommonModule, DynamicSidemenu],
  templateUrl: './dynamic-sidemenu-builder.html',
  styleUrl: './dynamic-sidemenu-builder.scss'
})
export class DynamicSidemenuBuilder {
  @Input() pageOptions: PageOption[] = [];
  @Input() title: string = 'Navigation';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() collapsible: boolean = true;
  @Input() showToggle: boolean = true;
  @Input() sortPages: boolean = true;
  
  @Output() pageSelected = new EventEmitter<PageOption>();
  @Output() menuToggled = new EventEmitter<boolean>();
  @Output() configChanged = new EventEmitter<SideMenuConfig>();

  get sideMenuConfig(): SideMenuConfig {
    const sortedPages = this.sortPages 
      ? this.sortPagesByOrder([...this.pageOptions])
      : this.pageOptions;

    const config: SideMenuConfig = {
      title: this.title,
      pages: sortedPages,
      collapsible: this.collapsible,
      collapsed: false,
      theme: this.theme,
      showToggle: this.showToggle
    };

    return config;
  }

  onPageSelected(page: PageOption): void {
    this.pageSelected.emit(page);
  }

  onMenuToggled(collapsed: boolean): void {
    this.menuToggled.emit(collapsed);
  }

  private sortPagesByOrder(pages: PageOption[]): PageOption[] {
    return pages.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    }).map(page => ({
      ...page,
      children: page.children ? this.sortPagesByOrder(page.children) : undefined
    }));
  }

  // Utility methods for building page options
  static createPageOption(
    id: string, 
    label: string, 
    options?: Partial<Omit<PageOption, 'id' | 'label'>>
  ): PageOption {
    return {
      id,
      label,
      route: options?.route,
      icon: options?.icon,
      children: options?.children,
      isActive: options?.isActive ?? false,
      isExpanded: options?.isExpanded ?? false,
      badge: options?.badge,
      order: options?.order,
      isVisible: options?.isVisible ?? true
    };
  }

  static createPageWithChildren(
    id: string,
    label: string,
    children: PageOption[],
    options?: Partial<Omit<PageOption, 'id' | 'label' | 'children'>>
  ): PageOption {
    return this.createPageOption(id, label, {
      ...options,
      children
    });
  }
}
