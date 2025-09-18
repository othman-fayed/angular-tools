export interface PageOption {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  children?: PageOption[];
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: {
    text: string;
    color: string;
  };
  order?: number;
  isVisible?: boolean;
}

export interface SideMenuConfig {
  title?: string;
  pages: PageOption[];
  collapsible?: boolean;
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  showToggle?: boolean;
}