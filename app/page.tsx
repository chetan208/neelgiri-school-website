import React from 'react';
import HeroSection from '@/components/sections/homeSections/hero/hero';
import NoticeSection from '@/components/sections/homeSections/news/NoticeSection';
import SchoolProfile from '@/components/sections/homeSections/profile/Profile';
import OurCourses from '@/components/sections/homeSections/ourCourses/OurCourses';
import DocumentationSection from '@/components/sections/homeSections/documentation/main';
import ContactUs from '@/components/sections/contactUs/main';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoticeSection />
      <SchoolProfile />
      <OurCourses />
      <DocumentationSection />
      <ContactUs isHomePage={true} />
    </>
  );
}