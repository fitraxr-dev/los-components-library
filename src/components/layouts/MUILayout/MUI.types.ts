import type { Theme } from '@mui/material/styles';


export type PageContainerProps = {
  children?: React.ReactNode;
  sidebarMenu: Menu[];
}

export type HeaderProps = {
  username: string;
  profilePicture?: string;
}

export type SidebarProps = {
  handleAction?: (menu: Menu) => void;
  sidebarMenu: Menu[];
}

export type SidebarContainerProps = {
  theme: Theme;
  isExpanded: boolean;
}

export type SidebarCollapseContentWrapperProps = {
  isFirstLayer: boolean;
  theme?: Theme;
}

export type Menu = {
  id: string;
  label: string;
  icon: string;
  path?: string;
  subMenu?: Array<Menu>;
}
