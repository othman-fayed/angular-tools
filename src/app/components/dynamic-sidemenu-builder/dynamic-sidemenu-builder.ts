import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageOption, SideMenuConfig } from '../../models/page-option.interface';
import { DynamicSidemenu } from '../dynamic-sidemenu/dynamic-sidemenu';

@Component({
  selector: 'app-dynamic-sidemenu-builder',
  imports: [CommonModule, DynamicSidemenu],
  templateUrl: './dynamic-sidemenu-builder.html',
  styleUrl: './dynamic-sidemenu-builder.scss'
})
export class DynamicSidemenuBuilder implements OnChanges {
  @Input() pageOptions: PageOption[] = [];
  @Input() title: string = 'Navigation';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() collapsible: boolean = true;
  @Input() showToggle: boolean = true;
  @Input() sortPages: boolean = true;

  @Output() pageSelected = new EventEmitter<PageOption>();
  @Output() menuToggled = new EventEmitter<boolean>();
  @Output() configChanged = new EventEmitter<SideMenuConfig>();

  private collapsedState = false;

  ngOnChanges(changes: SimpleChanges): void {
    let shouldEmit = false;

    if (changes['collapsible'] && !this.collapsible && this.collapsedState) {
      this.collapsedState = false;
      shouldEmit = true;
    }

    if (
      changes['pageOptions'] ||
      changes['title'] ||
      changes['theme'] ||
      changes['collapsible'] ||
      changes['showToggle'] ||
      changes['sortPages']
    ) {
      shouldEmit = true;
    }

    if (shouldEmit) {
      this.emitConfigChanged();
    }
  }

  get sideMenuConfig(): SideMenuConfig {
    const sortedPages = this.sortPages
      ? this.sortPagesByOrder([...this.pageOptions])
      : this.pageOptions;

    const config: SideMenuConfig = {
      title: this.title,
      pages: sortedPages,
      collapsible: this.collapsible,
      collapsed: this.collapsedState,
      theme: this.theme,
      showToggle: this.showToggle
    };

    return config;
  }

  onPageSelected(page: PageOption): void {
    this.pageSelected.emit(page);
  }

  onMenuToggled(collapsed: boolean): void {
    if (this.collapsedState !== collapsed) {
      this.collapsedState = collapsed;
      this.emitConfigChanged();
    }
    this.menuToggled.emit(collapsed);
  }

  private emitConfigChanged(): void {
    this.configChanged.emit(this.sideMenuConfigSnapshot());
  }

  private sideMenuConfigSnapshot(): SideMenuConfig {
    const sortedPages = this.sortPages
      ? this.sortPagesByOrder([...this.pageOptions])
      : this.pageOptions;

    return {
      title: this.title,
      pages: sortedPages,
      collapsible: this.collapsible,
      collapsed: this.collapsedState,
      theme: this.theme,
      showToggle: this.showToggle
    };
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
