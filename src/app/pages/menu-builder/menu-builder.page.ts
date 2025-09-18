import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageOption } from '../../models/page-option.interface';
import { DynamicSidemenu } from '../../components/dynamic-sidemenu/dynamic-sidemenu';

@Component({
  selector: 'app-menu-builder-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DynamicSidemenu],
  templateUrl: './menu-builder.page.html',
  styleUrl: './menu-builder.page.scss'
})
export class MenuBuilderPage {
  // Current menu being built
  currentMenu = signal<PageOption[]>([]);
  
  // Available pages that can be selected
  availablePages: PageOption[] = [
    { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: 'bi-speedometer2' },
    { id: 'users', label: 'User Management', route: '/users', icon: 'bi-people' },
    { id: 'products', label: 'Products', route: '/products', icon: 'bi-box-seam' },
    { id: 'orders', label: 'Orders', route: '/orders', icon: 'bi-cart' },
    { id: 'reports', label: 'Analytics & Reports', route: '/reports', icon: 'bi-graph-up' },
    { id: 'settings', label: 'Settings', route: '/settings', icon: 'bi-gear' },
    { id: 'profile', label: 'Profile', route: '/profile', icon: 'bi-person' },
    { id: 'notifications', label: 'Notifications', route: '/notifications', icon: 'bi-bell' },
    { id: 'help', label: 'Help & Support', route: '/help', icon: 'bi-question-circle' },
    { id: 'billing', label: 'Billing', route: '/billing', icon: 'bi-credit-card' },
  ];

  // Available Bootstrap icons
  availableIcons = [
    'bi-speedometer2', 'bi-people', 'bi-box-seam', 'bi-cart', 'bi-graph-up',
    'bi-gear', 'bi-person', 'bi-bell', 'bi-question-circle', 'bi-credit-card',
    'bi-house', 'bi-grid', 'bi-list', 'bi-folder', 'bi-file-text', 'bi-image',
    'bi-calendar', 'bi-clock', 'bi-star', 'bi-heart', 'bi-bookmark',
    'bi-tag', 'bi-tags', 'bi-shield', 'bi-shield-check', 'bi-lock',
    'bi-unlock', 'bi-eye', 'bi-eye-slash', 'bi-search', 'bi-plus',
    'bi-minus', 'bi-x', 'bi-check', 'bi-arrow-up', 'bi-arrow-down',
    'bi-arrow-left', 'bi-arrow-right', 'bi-chevron-up', 'bi-chevron-down',
    'bi-chevron-left', 'bi-chevron-right'
  ];

  // Menu presets
  menuPresets = {
    ecommerce: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'bi-speedometer2',
        order: 1
      },
      {
        id: 'products',
        label: 'Products',
        icon: 'bi-box-seam',
        order: 2,
        children: [
          { id: 'products-list', label: 'Product Catalog', route: '/products', icon: 'bi-grid' },
          { id: 'products-categories', label: 'Categories', route: '/products/categories', icon: 'bi-tags' },
          { id: 'products-inventory', label: 'Inventory', route: '/products/inventory', icon: 'bi-boxes' }
        ]
      },
      {
        id: 'orders',
        label: 'Orders',
        route: '/orders',
        icon: 'bi-cart',
        order: 3
      },
      {
        id: 'customers',
        label: 'Customers',
        route: '/customers',
        icon: 'bi-people',
        order: 4
      },
      {
        id: 'reports',
        label: 'Analytics',
        icon: 'bi-graph-up',
        order: 5,
        children: [
          { id: 'reports-sales', label: 'Sales Reports', route: '/reports/sales', icon: 'bi-bar-chart' },
          { id: 'reports-customers', label: 'Customer Analytics', route: '/reports/customers', icon: 'bi-people' }
        ]
      },
      {
        id: 'settings',
        label: 'Settings',
        route: '/settings',
        icon: 'bi-gear',
        order: 6
      }
    ],
    admin: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'bi-speedometer2',
        order: 1
      },
      {
        id: 'users',
        label: 'User Management',
        icon: 'bi-people',
        order: 2,
        children: [
          { id: 'users-list', label: 'All Users', route: '/users', icon: 'bi-person-lines-fill' },
          { id: 'users-add', label: 'Add User', route: '/users/add', icon: 'bi-person-plus' },
          { id: 'users-roles', label: 'Roles & Permissions', route: '/users/roles', icon: 'bi-shield-check' }
        ]
      },
      {
        id: 'system',
        label: 'System',
        icon: 'bi-gear',
        order: 3,
        children: [
          { id: 'system-logs', label: 'System Logs', route: '/system/logs', icon: 'bi-file-text' },
          { id: 'system-backup', label: 'Backup', route: '/system/backup', icon: 'bi-archive' },
          { id: 'system-maintenance', label: 'Maintenance', route: '/system/maintenance', icon: 'bi-tools' }
        ]
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'bi-shield',
        order: 4,
        children: [
          { id: 'security-audit', label: 'Audit Logs', route: '/security/audit', icon: 'bi-file-text' },
          { id: 'security-permissions', label: 'Permissions', route: '/security/permissions', icon: 'bi-shield-check' }
        ]
      }
    ],
    simple: [
      {
        id: 'home',
        label: 'Home',
        route: '/home',
        icon: 'bi-house',
        order: 1
      },
      {
        id: 'about',
        label: 'About',
        route: '/about',
        icon: 'bi-info-circle',
        order: 2
      },
      {
        id: 'contact',
        label: 'Contact',
        route: '/contact',
        icon: 'bi-envelope',
        order: 3
      }
    ]
  };

  selectedPreset = '';
  selectedMenuItem: PageOption | null = null;
  isEditing = false;

  // Edit form data
  editForm = {
    id: '',
    label: '',
    route: '',
    icon: '',
    order: 1
  };

  loadPreset(presetName: string): void {
    if (presetName && this.menuPresets[presetName as keyof typeof this.menuPresets]) {
      this.currentMenu.set([...this.menuPresets[presetName as keyof typeof this.menuPresets]]);
      this.selectedPreset = presetName;
    }
  }

  addMenuItem(): void {
    const newItem: PageOption = {
      id: `item-${Date.now()}`,
      label: 'New Menu Item',
      route: '/new-item',
      icon: 'bi-plus',
      order: this.currentMenu().length + 1
    };
    
    this.currentMenu.update(menu => [...menu, newItem]);
  }

  editMenuItem(item: PageOption): void {
    this.selectedMenuItem = item;
    this.isEditing = true;
    this.editForm = {
      id: item.id,
      label: item.label,
      route: item.route || '',
      icon: item.icon || '',
      order: item.order || 1
    };
  }

  saveMenuItem(): void {
    if (this.selectedMenuItem) {
      const updatedMenu = this.currentMenu().map(item => 
        item.id === this.selectedMenuItem!.id 
          ? {
              ...item,
              label: this.editForm.label,
              route: this.editForm.route,
              icon: this.editForm.icon,
              order: this.editForm.order
            }
          : item
      );
      
      this.currentMenu.set(updatedMenu);
      this.cancelEdit();
    }
  }

  deleteMenuItem(itemId: string): void {
    this.currentMenu.update(menu => 
      menu.filter(item => item.id !== itemId)
    );
  }

  cancelEdit(): void {
    this.selectedMenuItem = null;
    this.isEditing = false;
    this.editForm = {
      id: '',
      label: '',
      route: '',
      icon: '',
      order: 1
    };
  }

  moveItem(item: PageOption, direction: 'up' | 'down'): void {
    const menu = [...this.currentMenu()];
    const index = menu.findIndex(i => i.id === item.id);
    
    if (direction === 'up' && index > 0) {
      [menu[index], menu[index - 1]] = [menu[index - 1], menu[index]];
    } else if (direction === 'down' && index < menu.length - 1) {
      [menu[index], menu[index + 1]] = [menu[index + 1], menu[index]];
    }
    
    this.currentMenu.set(menu);
  }

  clearMenu(): void {
    this.currentMenu.set([]);
    this.selectedPreset = '';
  }

  // For the preview
  get previewConfig() {
    return {
      title: 'Preview',
      pages: this.currentMenu(),
      collapsible: true,
      collapsed: false,
      theme: 'light' as const,
      showToggle: true
    };
  }

  onPreviewPageSelected(page: PageOption): void {
    console.log('Preview page selected:', page);
  }

  onPreviewMenuToggled(collapsed: boolean): void {
    console.log('Preview menu toggled:', collapsed);
  }

  trackByPageId(index: number, page: PageOption): string {
    return page.id;
  }
}