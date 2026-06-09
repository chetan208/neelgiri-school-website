import React from 'react';
import HeroSection from '@/components/sections/homeSections/hero/hero';
import NoticeSection from '@/components/sections/homeSections/news/NoticeSection';
import SchoolProfile from '@/components/sections/homeSections/profile/Profile';
import OurCourses from '@/components/sections/homeSections/ourCourses/OurCourses';
import DocumentationSection from '@/components/sections/homeSections/documentation/main';
import EventsSection from '@/components/sections/homeSections/Events/Events';

// Dhyan dein: Yahan 'export default function' hona zaroori hai
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoticeSection />
      <SchoolProfile />
      <OurCourses />
      <DocumentationSection />
      <EventsSection />
    </>
  );
}