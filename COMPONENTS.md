# Dynamic Side Menu Components

This Angular library provides flexible and customizable dynamic side menu components built with Angular 20 and Bootstrap 5.

## Components

### DynamicSidemenu

The core side menu component that renders a navigation menu based on configuration.

#### Properties

- `@Input() config: SideMenuConfig` - Configuration object for the side menu
- `@Output() pageSelected: EventEmitter<PageOption>` - Emitted when a menu item is selected
- `@Output() menuToggled: EventEmitter<boolean>` - Emitted when menu is collapsed/expanded

#### Example Usage

```typescript
<app-dynamic-sidemenu 
  [config]="sideMenuConfig"
  (pageSelected)="onPageSelected($event)"
  (menuToggled)="onMenuToggled($event)">
</app-dynamic-sidemenu>
```

### DynamicSidemenuBuilder

A higher-level component that simplifies the creation of dynamic side menus.

#### Properties

- `@Input() pageOptions: PageOption[]` - Array of page options to display
- `@Input() title: string` - Menu title (default: 'Navigation')
- `@Input() theme: 'light' | 'dark'` - Theme for the menu (default: 'light')
- `@Input() collapsible: boolean` - Whether the menu can be collapsed (default: true)
- `@Input() showToggle: boolean` - Whether to show the toggle button (default: true)
- `@Input() sortPages: boolean` - Whether to sort pages by order (default: true)

#### Example Usage

```typescript
<app-dynamic-sidemenu-builder 
  [pageOptions]="pageOptions"
  [title]="'My App'"
  [theme]="'light'"
  [collapsible]="true"
  [showToggle]="true"
  (pageSelected)="onPageSelected($event)"
  (menuToggled)="onMenuToggled($event)">
</app-dynamic-sidemenu-builder>
```

## Interfaces

### PageOption

Represents a menu item in the side menu.

```typescript
interface PageOption {
  id: string;              // Unique identifier
  label: string;           // Display text
  route?: string;          // Angular route
  icon?: string;           // Bootstrap icon class (e.g., 'bi-home')
  children?: PageOption[]; // Nested menu items
  isActive?: boolean;      // Whether the item is currently active
  isExpanded?: boolean;    // Whether the submenu is expanded
  badge?: {                // Optional badge
    text: string;
    color: string;
  };
  order?: number;          // Sort order
  isVisible?: boolean;     // Whether the item is visible
}
```

### SideMenuConfig

Configuration object for the side menu.

```typescript
interface SideMenuConfig {
  title?: string;          // Menu title
  pages: PageOption[];     // Array of page options
  collapsible?: boolean;   // Whether menu can be collapsed
  collapsed?: boolean;     // Current collapsed state
  theme?: 'light' | 'dark'; // Theme
  showToggle?: boolean;    // Whether to show toggle button
}
```

## Features

- **Dynamic menu generation** from page options
- **Nested menu support** with unlimited depth
- **Bootstrap 5 styling** and icons
- **Collapsible functionality** with smooth animations
- **Badge support** for notifications and counters
- **Theme support** (light/dark)
- **Responsive design** for mobile devices
- **Route integration** with Angular Router
- **Keyboard accessibility** support
- **Customizable styling** with SCSS variables

## Styling

The components use Bootstrap 5 classes and custom SCSS. You can customize the appearance by overriding the CSS variables:

```scss
.dynamic-sidemenu {
  --sidemenu-width: 280px;
  --sidemenu-collapsed-width: 60px;
  --sidemenu-bg: var(--bs-white);
  --sidemenu-border: var(--bs-border-color);
}
```

## Responsive Behavior

On mobile devices (< 768px), the side menu automatically becomes a fixed overlay that can be toggled on/off.

## Accessibility

The components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast theme support