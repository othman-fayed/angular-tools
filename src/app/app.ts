import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicSidemenuBuilder } from './components/dynamic-sidemenu-builder/dynamic-sidemenu-builder';
import { PageOption } from './models/page-option.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicSidemenuBuilder],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-tools');

  // Sample page options to demonstrate the dynamic sidemenu
  pageOptions: PageOption[] = [
    {
      id: 'menu-builder',
      label: 'Menu Builder',
      route: '/menu-builder',
      icon: 'bi-tools',
      isActive: false,
      order: 0
    },
    {
      id: 'razor-editor',
      label: 'Razor Editor',
      route: '/razor-editor',
      icon: 'bi-code-slash',
      isActive: true,
      order: 1
    },
    {
      id: 'sequence-designer',
      label: 'Sequence Designer',
      route: '/sequence-designer',
      icon: 'bi-diagram-3',
      isActive: false,
      order: 2
    },
    {
      id: 'bpmn-modeler',
      label: 'BPMN Modeler',
      route: '/bpmn-modeler',
      icon: 'bi-diagram-2',
      isActive: false,
      order: 3
    },
    {
      id: 'logic-flow',
      label: 'LogicFlow Designer',
      route: '/logic-flow',
      icon: 'bi-bezier2',
      isActive: false,
      order: 4
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'bi-speedometer2',
      isActive: false,
      order: 5
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'bi-people',
      isExpanded: false,
      order: 6,
      children: [
        {
          id: 'users-list',
          label: 'All Users',
          route: '/users',
          icon: 'bi-person-lines-fill'
        },
        {
          id: 'users-add',
          label: 'Add User',
          route: '/users/add',
          icon: 'bi-person-plus'
        },
        {
          id: 'users-roles',
          label: 'Roles & Permissions',
          route: '/users/roles',
          icon: 'bi-shield-check',
          badge: {
            text: 'New',
            color: 'success'
          }
        }
      ]
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'bi-box-seam',
      isExpanded: false,
      order: 7,
      children: [
        {
          id: 'products-list',
          label: 'Product Catalog',
          route: '/products',
          icon: 'bi-grid'
        },
        {
          id: 'products-categories',
          label: 'Categories',
          route: '/products/categories',
          icon: 'bi-tags'
        },
        {
          id: 'products-inventory',
          label: 'Inventory',
          route: '/products/inventory',
          icon: 'bi-boxes',
          badge: {
            text: '12',
            color: 'warning'
          }
        }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      route: '/orders',
      icon: 'bi-cart',
      order: 8,
      badge: {
        text: '5',
        color: 'danger'
      }
    },
    {
      id: 'reports',
      label: 'Analytics & Reports',
      icon: 'bi-graph-up',
      order: 9,
      children: [
        {
          id: 'reports-sales',
          label: 'Sales Reports',
          route: '/reports/sales',
          icon: 'bi-bar-chart'
        },
        {
          id: 'reports-users',
          label: 'User Analytics',
          route: '/reports/users',
          icon: 'bi-people'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: 'bi-gear',
      order: 10
    }
  ];

  onPageSelected(page: PageOption): void {
    console.log('Page selected:', page);
    // Handle page selection - navigation would typically be handled by RouterOutlet
  }

  onMenuToggled(collapsed: boolean): void {
    console.log('Menu toggled:', collapsed);
    // Handle menu toggle state
  }

  getAngularVersion(): string {
    return '20';
  }
}
