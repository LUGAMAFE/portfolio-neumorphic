'use client';
import { CustomCursor } from '@/components/CustomCursor';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/sass/style.scss';
import { useCallback, useState } from 'react';
import { IntroSection } from './IntroSection';
import { Navbar } from './Navbar';
import { SectionPoints } from './SectionPoints';
import { SidebarMenu } from './SidebarMenu';

export const Portfolio = () => {
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);

  const toggleSidebar = useCallback((value: boolean) => {
    setIsSidebarMenuOpen(value);
  }, []);

  return (
    <AppProviders>
      <CustomCursor />
      <Navbar setIsSidebarMenuOpen={toggleSidebar} />
      <SectionPoints />
      <SidebarMenu isOpen={isSidebarMenuOpen} setIsOpen={toggleSidebar} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <IntroSection />
        </div>
      </div>
    </AppProviders>
  );
};
