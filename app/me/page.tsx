'use client';

import React from "react";
import { Protected } from "@/components/Protected";
import MyProfile from "@/components/sections/profile/MyProfile";

export default function MyProfilePageRoute() {
  return (
    <Protected>
      <MyProfile />
    </Protected>
  );
}