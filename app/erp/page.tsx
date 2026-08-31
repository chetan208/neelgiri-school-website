'use client';

import React, { Suspense } from "react";
import { OwnerProtected } from "@/components/Protected";
import ERPHeader from "@/components/erp/ERPHeader";
import { ERPDashboardContent } from "@/erp";

export default function ERPPage() {
  return (
    <OwnerProtected>
      <ERPHeader />
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading ERP...</div>}>
        <ERPDashboardContent />
      </Suspense>
    </OwnerProtected>
  );
}
