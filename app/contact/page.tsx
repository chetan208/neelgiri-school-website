import ContactUs from "@/components/sections/contactUs/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Neelgiri Public School",
  description: "Get in touch with Neelgiri Public School. Find our official contact details, address, maps, and submit inquiry messages.",
};

export default function Contact() {
  return (
    <div>
      <ContactUs />
    </div>
  );
}