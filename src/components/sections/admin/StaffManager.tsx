'use client';

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, Mail, Phone, Loader2, CheckCircle2, AlertTriangle, X, ShieldAlert, Users, Shield, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface TeacherType {
  name: string;
  email: string;
  subject?: string;
  phoneNumber?: string;
  qualification?: string;
  bio?: string;
  imageUrl?: string;
  role: "Teacher" | "Admin" | "Owner";
  isPrincipal?: boolean;
}

export default function StaffManager() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "admins">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Teacher" as "Teacher" | "Admin",
    subject: "",
    phoneNumber: ""
  });

  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "confirm" | "error" | "warning";
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({ show: false, type: "success", title: "", message: "", onConfirm: null });

  const triggerSuccessPopup = (title: string, message: string) => {
    setPopup({ show: true, type: "success", title, message, onConfirm: null });
  };

  const triggerConfirmPopup = (title: string, message: string, onConfirmAction: () => void) => {
    setPopup({ show: true, type: "confirm", title, message, onConfirm: onConfirmAction });
  };

  const triggerWarningPopup = (title: string, message: string, onConfirmAction: () => void) => {
    setPopup({ show: true, type: "warning", title, message, onConfirm: onConfirmAction });
  };

  const triggerErrorPopup = (title: string, message: string) => {
    setPopup({ show: true, type: "error", title, message, onConfirm: null });
  };

  const closePopup = () => {
    if (deleteLoading) return;
    setPopup(prev => ({ ...prev, show: false }));
  };

  const fetchTeachers = async () => {
    setLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const res = await axios.get(`${SERVER_URL}/api/teachers`);
      if (res.data && res.data.teachers) {
        const mappedTeachers: TeacherType[] = res.data.teachers.map((t: any) => ({
          name: t.name || "",
          email: t.email || "",
          subject: t.subject || "",
          phoneNumber: t.phoneNum || "",
          qualification: t.qualification || "",
          bio: t.bio || "",
          imageUrl: t.imageUrl || "",
          role: t.role || "Teacher",
          isPrincipal: t.isPrincipal || false
        }));
        setTeachers(mappedTeachers);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finaly: {
      setLoading(false);
    }
  };

  // Quick fix for finaly syntax typo
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
      try {
        const res = await axios.get(`${SERVER_URL}/api/teachers`);
        if (res.data && res.data.teachers) {
          const mappedTeachers: TeacherType[] = res.data.teachers.map((t: any) => ({
            name: t.name || "",
            email: t.email || "",
            subject: t.subject || "",
            phoneNumber: t.phoneNum || "",
            qualification: t.qualification || "",
            bio: t.bio || "",
            imageUrl: t.imageUrl || "",
            role: t.role || "Teacher",
            isPrincipal: t.isPrincipal || false
          }));
          setTeachers(mappedTeachers);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

    const isAddingAdmin = formData.role === "Admin";

    try {
      if (isAddingAdmin) {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase()
        };
        await axios.post(`${SERVER_URL}/api/auth/add-admin`, payload, { withCredentials: true });
        triggerSuccessPopup("Admin Registered", `${payload.name} has been successfully registered as a school Admin.`);
      } else {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim(),
          phoneNum: formData.phoneNumber.trim() ? formData.phoneNumber.trim() : undefined
        };
        await axios.post(`${SERVER_URL}/api/teachers/add-teacher`, payload, { withCredentials: true });
        triggerSuccessPopup("Teacher Registered", `${payload.name} has been successfully added to the school staff registry.`);
      }
      resetForm();
      // Refetch
      const res = await axios.get(`${SERVER_URL}/api/teachers`);
      if (res.data && res.data.teachers) {
        setTeachers(res.data.teachers.map((t: any) => ({
          name: t.name || "",
          email: t.email || "",
          subject: t.subject || "",
          phoneNumber: t.phoneNum || "",
          role: t.role || "Teacher",
          isPrincipal: t.isPrincipal || false
        })));
      }
    } catch (error: any) {
      console.error("Error adding staff:", error);
      const errMsg = error.response?.data?.message || "Failed to register staff member. Please check details and try again.";
      triggerErrorPopup("Registration Failed", errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const executeRoleUpdate = async (email: string, targetRole: "Teacher" | "Admin" | "Owner") => {
    setRoleUpdateLoading(email);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      await axios.put(`${SERVER_URL}/api/teachers/update-role`, { email, role: targetRole }, { withCredentials: true });
      
      setTeachers(prev => prev.map(t => t.email === email ? { ...t, role: targetRole } : t));
      triggerSuccessPopup("Role Updated", `The user's role has been successfully changed to ${targetRole}.`);
    } catch (error: any) {
      console.error("Error updating role:", error);
      const errMsg = error.response?.data?.message || "Failed to update user role.";
      triggerErrorPopup("Update Failed", errMsg);
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  const handleRoleChange = (email: string, name: string, currentRole: string, targetRole: "Teacher" | "Admin" | "Owner") => {
    if (targetRole === "Owner") {
      triggerWarningPopup(
        "Critical Role Escalation Warning!",
        `You are about to promote ${name} (${email}) to Owner. Owners have full database administrative control, including the ability to demote or delete other Owners and Admins. This action should only be granted to highly trusted individuals. Are you absolutely sure?`,
        () => {
          closePopup();
          executeRoleUpdate(email, targetRole);
        }
      );
    } else {
      triggerConfirmPopup(
        "Confirm Role Modification",
        `Change ${name}'s role from ${currentRole} to ${targetRole}?`,
        () => {
          closePopup();
          executeRoleUpdate(email, targetRole);
        }
      );
    }
  };

  const handleDelete = (email: string, name: string, staffRole: string) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    const roleText = staffRole === "Owner" ? "Owner account" : staffRole === "Admin" ? "Admin account" : "staff member";
    triggerConfirmPopup(
      "Remove Staff Member",
      `Are you sure you want to remove ${name} (${email})? This will permanently delete this ${roleText} from the staff database and revoke all login permissions.`,
      async () => {
        setDeleteLoading(true);
        try {
          await axios.delete(`${SERVER_URL}/api/teachers/${email}`, { withCredentials: true });
          setTeachers(teachers.filter((t) => t.email !== email));
          setDeleteLoading(false);
          closePopup();
          setTimeout(() => {
            triggerSuccessPopup("Staff Removed", "The staff record has been permanently deleted.");
          }, 200);
        } catch (error: any) {
          console.error("Error deleting staff member:", error);
          setDeleteLoading(false);
          closePopup();
          setTimeout(() => {
            const errMsg = error.response?.data?.message || "Failed to delete staff member.";
            triggerErrorPopup("Deletion Failed", errMsg);
          }, 200);
        }
      }
    );
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "Teacher", subject: "", phoneNumber: "" });
    setShowForm(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    const query = searchQuery.toLowerCase();
    
    // Apply search filter
    const matchesSearch = (
      t.name.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query) ||
      (t.subject && t.subject.toLowerCase().includes(query))
    );

    // Apply Admin tab filter
    if (activeFilter === "admins") {
      return matchesSearch && (t.role === "Admin" || t.role === "Owner");
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">Staff & Admin Management</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage credentials, administrative roles, and database read/write permissions.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#093C5D] hover:bg-[#FA6781] text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-2xs border-0 cursor-pointer w-full sm:w-auto"
          >
            <Plus size={16} /> Register New Staff
          </button>
        )}
      </div>

      {/* Unified Registration Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Register New {formData.role === "Admin" ? "Administrator" : "Staff Member"}
            </h3>
            <button type="button" onClick={resetForm} className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Registration Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition cursor-pointer"
              >
                <option value="Teacher">Teacher (Standard Staff)</option>
                <option value="Admin">Administrator (Admin Privileges)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Prof. Rajesh Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
              />
            </div>

            <div className={formData.role === "Admin" ? "md:col-span-2" : ""}>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g., rajesh.sharma@neelgiri.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
              />
            </div>

            {formData.role === "Teacher" && (
              <>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Subject Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Chemistry, Mathematics"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number <span className="text-slate-400 font-bold normal-case">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., +91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-[#093C5D] hover:bg-[#FA6781] text-white py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-70 shadow-2xs border-0 cursor-pointer"
          >
            {submitLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitLoading ? "Registering User..." : `Register ${formData.role === "Admin" ? "Administrator" : "Staff Member"}`}
          </button>
        </form>
      )}

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer bg-transparent border-0 ${
              activeFilter === "all"
                ? "border-[#093C5D] text-[#093C5D]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Users size={14} />
            <span>All Staff ({teachers.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter("admins")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer bg-transparent border-0 ${
              activeFilter === "admins"
                ? "border-[#093C5D] text-[#093C5D]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Shield size={14} />
            <span>Administrators ({teachers.filter(t => t.role === "Admin" || t.role === "Owner").length})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-xs sm:self-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
          />
        </div>
      </div>

      {/* Staff Grid/Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 animate-pulse">
            <Loader2 className="animate-spin text-[#093C5D]" size={28} />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Staff Records...</p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Staff Details</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Access Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Subject Area</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Details</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((teacher) => {
                    const initials = teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const isSelf = teacher.email === user?.email;
                    
                    return (
                      <tr key={teacher.email} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#093C5D]/10 text-[#093C5D] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials || "ST"}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">
                              {teacher.name} {isSelf && <span className="text-[10px] text-slate-400 font-semibold italic">(You)</span>}
                            </span>
                            {teacher.isPrincipal && (
                              <span className="inline-block text-[9px] font-bold bg-cyan-50 border border-cyan-200 text-cyan-700 px-1.5 py-0.2 rounded mt-0.5 uppercase tracking-wide">Principal</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isSelf || roleUpdateLoading === teacher.email ? (
                            <div className="flex items-center gap-1.5">
                              {roleUpdateLoading === teacher.email && <Loader2 size={12} className="animate-spin text-[#093C5D]" />}
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                teacher.role === "Owner" 
                                  ? "bg-rose-50 border-rose-200 text-rose-700" 
                                  : teacher.role === "Admin" 
                                    ? "bg-blue-50 border-blue-200 text-blue-700" 
                                    : "bg-slate-100 border-slate-200 text-slate-600"
                              }`}>
                                {teacher.role}
                              </span>
                            </div>
                          ) : (
                            <select
                              value={teacher.role}
                              onChange={(e) => handleRoleChange(teacher.email, teacher.name, teacher.role, e.target.value as any)}
                              className={`px-2 py-1 bg-slate-50 border rounded text-xs font-semibold focus:outline-none focus:border-[#093C5D] cursor-pointer ${
                                teacher.role === "Owner"
                                  ? "border-rose-200 text-rose-700 font-bold"
                                  : teacher.role === "Admin"
                                    ? "border-blue-200 text-blue-700 font-bold"
                                    : "border-slate-200 text-slate-600"
                              }`}
                            >
                              <option value="Teacher">Teacher</option>
                              <option value="Admin">Admin</option>
                              <option value="Owner">Owner</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {teacher.subject ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                              {teacher.subject}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-xs">Administrative</span>
                          )}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <a href={`mailto:${teacher.email}`} className="text-xs text-[#093C5D] hover:underline flex items-center gap-1 font-medium no-underline">
                            <Mail size={12} className="text-slate-400" />
                            {teacher.email}
                          </a>
                          {teacher.phoneNumber && (
                            <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
                              <Phone size={12} className="text-slate-400" />
                              {teacher.phoneNumber}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(teacher.email, teacher.name, teacher.role)}
                            disabled={isSelf || teacher.isPrincipal}
                            title={isSelf ? "You cannot delete your own account" : teacher.isPrincipal ? "Cannot delete principal" : "Delete Member"}
                            className={`p-2 rounded-lg transition border-0 bg-transparent cursor-pointer ${
                              isSelf || teacher.isPrincipal 
                                ? "text-slate-200 cursor-not-allowed" 
                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => {
                const initials = teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const isSelf = teacher.email === user?.email;
                
                return (
                  <div key={teacher.email} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#093C5D]/10 text-[#093C5D] font-bold text-xs flex items-center justify-center shrink-0">
                          {initials || "ST"}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">
                            {teacher.name} {isSelf && <span className="text-[10px] text-slate-400 font-semibold italic">(You)</span>}
                          </span>
                          {teacher.subject && (
                            <span className="text-[10px] font-semibold text-slate-500 block">{teacher.subject}</span>
                          )}
                          {teacher.isPrincipal && (
                            <span className="inline-block text-[9px] font-bold bg-cyan-50 border border-cyan-200 text-cyan-700 px-1.5 py-0.2 rounded mt-0.5 uppercase tracking-wide">Principal</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(teacher.email, teacher.name, teacher.role)}
                        disabled={isSelf || teacher.isPrincipal}
                        className={`p-2 rounded-lg transition border-0 bg-transparent cursor-pointer ${
                          isSelf || teacher.isPrincipal 
                            ? "text-slate-200 cursor-not-allowed" 
                            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Access Level</span>
                        {isSelf || roleUpdateLoading === teacher.email ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-[#093C5D]">
                            {roleUpdateLoading === teacher.email && <Loader2 size={10} className="animate-spin" />}
                            <span className="uppercase tracking-wider text-[9px] px-2 py-0.5 rounded border bg-slate-50 border-slate-200 text-slate-600">{teacher.role}</span>
                          </div>
                        ) : (
                          <select
                            value={teacher.role}
                            onChange={(e) => handleRoleChange(teacher.email, teacher.name, teacher.role, e.target.value as any)}
                            className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold focus:outline-none"
                          >
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                          </select>
                        )}
                      </div>

                      <div className="text-right space-y-1 text-xs">
                        <a href={`mailto:${teacher.email}`} className="text-[#093C5D] hover:underline flex items-center justify-end gap-1 font-medium no-underline">
                          <Mail size={11} className="text-slate-400" />
                          {teacher.email}
                        </a>
                        {teacher.phoneNumber && (
                          <div className="text-slate-600 flex items-center justify-end gap-1 font-medium">
                            <Phone size={11} className="text-slate-400" />
                            {teacher.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
            {searchQuery ? "No matching staff records found." : "No staff records registered."}
          </div>
        )}
      </div>

      {/* Global Actions Popups */}
      {popup.show && (
        <div className="fixed inset-0 bg-[#06283D]/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button onClick={closePopup} disabled={deleteLoading} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition disabled:opacity-50 border-0 bg-transparent cursor-pointer">
              <X size={16} />
            </button>
            
            {popup.type === "success" && (
              <div className="mx-auto bg-[#59B292]/10 text-[#59B292] w-12 h-12 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            )}

            {popup.type === "confirm" && (
              <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            )}

            {popup.type === "warning" && (
              <div className="mx-auto bg-amber-50 text-amber-600 w-12 h-12 rounded-full flex items-center justify-center border border-amber-200">
                <ShieldAlert size={24} className="stroke-[2]" />
              </div>
            )}

            {popup.type === "error" && (
              <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">{popup.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-relaxed">{popup.message}</p>
            </div>

            <div className="flex gap-2 pt-2">
              {popup.type === "confirm" || popup.type === "warning" ? (
                <>
                  <button 
                    onClick={popup.onConfirm ?? undefined} 
                    disabled={deleteLoading} 
                    className={`flex-1 py-2.5 text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-75 border-0 cursor-pointer ${
                      popup.type === "warning" ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"
                    }`}
                  >
                    {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                    <span>Confirm Escalation</span>
                  </button>
                  <button 
                    onClick={closePopup} 
                    disabled={deleteLoading} 
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-bold transition disabled:opacity-50 border-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={closePopup} className="w-full py-2.5 bg-[#093C5D] hover:bg-[#06283D] text-white rounded-lg text-xs sm:text-sm font-bold transition border-0 cursor-pointer">
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
