import React from "react";
import GalleryContent from "./GalleryContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery & Events | Neelgiri Public School",
  description: "Browse the picture and video collections of campus life, academic events, annual sports functions, and school celebrations at Neelgiri School.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}