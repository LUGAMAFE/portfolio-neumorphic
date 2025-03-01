'use client';
import { CustomCursor } from '@/components/CustomCursor';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/sass/style.scss';
import { useMemo, useState } from 'react';
import { IntroSection } from './IntroSection';
import { Navbar } from './Navbar';
import { SectionPoints } from './SectionPoints';
import { SidebarMenu } from './SidebarMenu';

export const Portfolio = () => {
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);

  const memoizedCustomCursor = useMemo(() => <CustomCursor />, []);
  const memoizedSectionPoints = useMemo(() => <SectionPoints />, []);
  const memoizedIntroSection = useMemo(() => <IntroSection />, []);

  return (
    <AppProviders>
      {memoizedCustomCursor}
      <Navbar setIsSidebarMenuOpen={setIsSidebarMenuOpen} />
      {memoizedSectionPoints}
      <SidebarMenu isOpen={isSidebarMenuOpen} setIsOpen={setIsSidebarMenuOpen} />
      <div id="smooth-wrapper">
        <div id="smooth-content">{memoizedIntroSection}</div>
      </div>
    </AppProviders>
  );
};
