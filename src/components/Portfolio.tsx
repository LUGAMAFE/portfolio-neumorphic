'use client';
import { CustomCursor } from '@/components/CustomCursor';
import { NeumorphicStylesProvider } from '@/providers/NeumorphicStylesProvider';
import '@/styles/sass/style.scss';
import gsap from 'gsap';
import ScrollSmoother from 'gsap-trial/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { IntroSection } from './IntroSection';
import { Navbar } from './Navbar';
import { SectionPoints } from './SectionPoints';
import { SidebarMenu } from './SidebarMenu';

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export const Portfolio = () => {
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  return (
    <NeumorphicStylesProvider>
      <CustomCursor />
      <Navbar setIsSidebarMenuOpen={setIsSidebarMenuOpen} />
      <SectionPoints />
      <SidebarMenu isOpen={isSidebarMenuOpen} setIsOpen={setIsSidebarMenuOpen} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <IntroSection />
        </div>
      </div>
    </NeumorphicStylesProvider>
  );
};
