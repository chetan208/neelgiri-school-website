'use client';

import React from "react";
import { OwnerProtected } from "@/components/Protected";
import ERPHeader from "@/components/erp/ERPHeader";
import { ERPDashboardContent } from "@/erp";

export default function ERPPage() {
  return (
    <OwnerProtected>
      <ERPHeader />
      <ERPDashboardContent />
    </OwnerProtected>
  );
}
