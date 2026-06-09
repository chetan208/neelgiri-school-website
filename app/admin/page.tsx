'use client';

import React from "react";
import { AdminProtected } from "@/components/Protected";
import AdminDashboard from "@/components/sections/admin/AdminDashboard";

export default function AdminDashboardPageRoute() {
  return (
    <AdminProtected>
      <AdminDashboard />
    </AdminProtected>
  );
}