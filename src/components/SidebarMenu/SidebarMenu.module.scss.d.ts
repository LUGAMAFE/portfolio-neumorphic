export type Styles = {
  SidebarMenu: string;
  SidebarMenu_button: string;
  SidebarMenu_divider: string;
  SidebarMenu_esButtonText: string;
  SidebarMenu_imageContainer: string;
  SidebarMenu_listElement: string;
  SidebarMenu_listElementText: string;
  SidebarMenu_listImage: string;
  SidebarMenu_listSVG: string;
  SidebarMenu_menuSVG: string;
  SidebarMenu_neuContainer: string;
  SidebarMenu_radio: string;
  SidebarMenu_sectionsContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
