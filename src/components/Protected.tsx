'use client';

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100/80">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-12 h-12 rounded-full border-2 border-teal-500/10 scale-110" />
      <Loader2 className="animate-spin text-teal-600" size={28} />
    </div>
    <p className="text-xs font-bold tracking-wider text-slate-400 mt-4 uppercase animate-pulse">
      {message}
    </p>
  </div>
);

interface ProtectedProps {
  children: React.ReactNode;
}

export const Protected = ({ children }: ProtectedProps) => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading) return <LoadingScreen message="Verifying session" />;
  if (!user) return null;

  return <>{children}</>;
};

export const AdminProtected = ({ children }: ProtectedProps) => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "Admin" && user.role !== "Owner"))) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading) return <LoadingScreen message="Verifying access" />;
  if (!user || (user.role !== "Admin" && user.role !== "Owner")) return null;

  return <>{children}</>;
};

export const OwnerProtected = ({ children }: ProtectedProps) => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "Owner")) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading) return <LoadingScreen message="Verifying privileges" />;
  if (!user || user.role !== "Owner") return null;

  return <>{children}</>;
};

export const AuthProtected = ({ children }: ProtectedProps) => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;
  if (user) return null;

  return <>{children}</>;
};