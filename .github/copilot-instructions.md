# Copilot Instructions for angular-tools

This repository contains an Angular 20 application with various development tools including a menu builder, Razor editor, and sequence diagram designer.

## Project Overview

**angular-tools** is a collection of Angular-based development tools built with:
- **Angular 20.3** (latest)
- **Bootstrap 5.3** for UI styling
- **Bootstrap Icons** for iconography
- **Monaco Editor** for code editing features
- **TypeScript 5.9** with strict mode enabled

### Key Applications

1. **Menu Builder** (`src/app/pages/menu-builder/`) - Interactive tool for building dynamic side menus
2. **Razor Editor** (`src/app/pages/razor-editor/`) - Monaco-based editor for ASP.NET Razor pages
3. **Sequence Diagram Designer** (`src/app/pages/sequence-designer/`) - Visual designer for sequence diagrams

### Reusable Components

Located in `src/app/components/`:
- `dynamic-sidemenu` - Core navigation menu component
- `dynamic-sidemenu-builder` - Higher-level menu building component
- `sequence-diagram-designer` - Sequence diagram visualization component

## Technology Stack & Conventions

### Angular Specific

- **Version**: Angular 20.3 with standalone components (no NgModules)
- **Signals**: Use Angular signals for reactive state management
- **Routing**: File-based routing defined in `src/app/app.routes.ts`
- **Component Naming**: Use `.page.ts` suffix for page components, `.component.ts` for reusable components
- **Template Syntax**: Use Angular's standalone component pattern with `imports` array. Use `@if` and `@for` directives where applicable. 
- **Styling**: SCSS with component-scoped styles (`.scss` files)

### TypeScript Configuration

- **Strict Mode**: Enabled - all code must be type-safe
- **Target**: ES2022
- **Compiler Options**:
  - `strict: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`
  - `strictTemplates: true`
- **Decorators**: Experimental decorators enabled for Angular

### Code Style

- **Indentation**: 2 spaces (enforced by `.editorconfig`)
- **Quotes**: Single quotes for TypeScript/JavaScript
- **Line Endings**: LF
- **Trailing Whitespace**: Remove (except in Markdown)
- **Prettier**: Configured with 100 character line width

### UI Framework

- **Bootstrap 5.3**: Use Bootstrap classes for layout and styling
- **Bootstrap Icons**: Use `bi-*` classes for icons (e.g., `bi-home`, `bi-pencil`)
- **Responsive Design**: Mobile-first approach, breakpoint at 768px for side menu
- **Themes**: Support for light/dark themes where applicable

## Build, Test & Development

### Commands

```bash
# Development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build

# Run unit tests
npm test
# or
ng test

# Watch mode for development
npm run watch
```

### Build Output

- Production builds go to `dist/` directory
- Bundle size budgets:
  - Warning: 500kB
  - Error: 1MB
- Monaco Editor assets are copied to `assets/monaco/`

### Testing

- **Framework**: Karma + Jasmine
- **Location**: Tests are in `.spec.ts` files alongside source files
- Run tests before committing changes

## File Organization

```
src/app/
├── components/          # Reusable components
│   ├── dynamic-sidemenu/
│   ├── dynamic-sidemenu-builder/
│   └── sequence-diagram-designer/
├── pages/              # Page components (routes)
│   ├── menu-builder/
│   ├── razor-editor/
│   └── sequence-designer/
├── models/             # TypeScript interfaces and types
├── app.routes.ts       # Application routing configuration
├── app.config.ts       # Application configuration
└── app.ts             # Root component
```

## Component Development Guidelines

### Creating Components

- Use Angular CLI for scaffolding: `ng generate component component-name`
- Prefer standalone components
- Import only what you need in the `imports` array
- Use signals for reactive state when possible

### Page Components

- Suffix with `.page.ts` (e.g., `menu-builder.page.ts`)
- Each page should have its own directory under `src/app/pages/`
- Include template (`.html`), styles (`.scss`), and spec files

### Reusable Components

- Suffix with `.component.ts`
- Place in `src/app/components/` directory
- Should be framework-agnostic where possible
- Document inputs/outputs clearly

### Component Interfaces

Define interfaces in the component file or in `src/app/models/` for shared types:

```typescript
interface PageOption {
  id: string;
  label: string;
  route?: string;
  icon?: string;  // Bootstrap icon class
  children?: PageOption[];
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: { text: string; color: string; };
  order?: number;
  isVisible?: boolean;
}
```

## Styling Guidelines

### SCSS Usage

- Component-scoped styles in `.component.scss` or `.page.scss`
- Global styles in `src/styles.scss`
- Use CSS variables for theming
- Leverage Bootstrap's utility classes

### Bootstrap Integration

- Bootstrap CSS and Icons are globally available
- Use Bootstrap's grid system for layouts
- Prefer Bootstrap utilities over custom CSS
- Common icons: `bi-home`, `bi-pencil`, `bi-trash`, `bi-download`, etc.

### Responsive Design

```scss
// Mobile-first approach
.my-component {
  // Mobile styles
  
  @media (min-width: 768px) {
    // Tablet and desktop styles
  }
}
```

## Monaco Editor Integration

When working with Monaco Editor:

- Monaco assets are in `node_modules/monaco-editor`
- Loaded via `@monaco-editor/loader` package
- Configuration path: `assets/monaco/min/vs`
- Initialize in `ngAfterViewInit()` lifecycle hook
- Always dispose editor in `ngOnDestroy()`

Example:
```typescript
import loader from '@monaco-editor/loader';

ngOnInit(): void {
  loader.config({ paths: { vs: 'assets/monaco/min/vs' } });
}

ngAfterViewInit(): void {
  loader.init().then((monaco) => {
    this.editor = monaco.editor.create(element, options);
  });
}
```

## Common Patterns

### Signal Usage

```typescript
// Define reactive state with signals
currentMenu = signal<PageOption[]>([]);

// Update signal value
this.currentMenu.set(newValue);

// Read signal value in template
{{ currentMenu().length }}
```

### Event Emitters

```typescript
@Output() pageSelected = new EventEmitter<PageOption>();

selectPage(page: PageOption): void {
  this.pageSelected.emit(page);
}
```

### Routing

```typescript
// In app.routes.ts
export const routes: Routes = [
  { path: 'menu-builder', component: MenuBuilderPage },
  { path: '', redirectTo: '/menu-builder', pathMatch: 'full' }
];
```

## Documentation

- **README.md**: General project information and CLI usage
- **COMPONENTS.md**: Detailed component documentation with interfaces and examples
- Keep documentation up-to-date when adding features
- Include code examples for complex components

## Accessibility

All components should include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast theme support

## Additional Notes

- **Standalone Components**: This project uses Angular's standalone component pattern exclusively
- **No NgModules**: Do not create or use NgModules
- **Bootstrap First**: Always check if Bootstrap has a utility before writing custom CSS
- **Type Safety**: Never use `any` type - always define proper types/interfaces
- **Monaco Assets**: Monaco Editor files are copied during build - don't commit them to git

## When Making Changes

1. Run development server to test changes live
2. Ensure TypeScript compilation succeeds (strict mode)
3. Run tests if modifying existing functionality
4. Follow existing patterns and conventions
5. Update COMPONENTS.md if adding/modifying public-facing components
6. Respect the project's minimalist approach - don't over-engineer
