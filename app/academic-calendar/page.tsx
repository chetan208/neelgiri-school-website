import React from 'react';
import { Metadata } from 'next';
import CalendarContent from './CalendarContent';

export const metadata: Metadata = {
  title: "Academic Calendar | Neelgiri Public School",
  description: "View the official academic calendar of Neelgiri Public School. Check upcoming exam dates, school holidays, cultural events, and term timelines.",
};

export default function AcademicCalendarPage() {
  return <CalendarContent />;
}
