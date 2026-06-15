'use client';

import React, { useState, useEffect } from "react";
import { Plus, Search, Loader2, CheckCircle2, AlertTriangle, X, Users, UserPlus, Calendar, CreditCard, Bus } from "lucide-react";
import axios from "axios";

interface StudentType {
  id: string;
  name: string;
  studentClass: string;
  fatherName: string;
  motherName: string;
  dateOfAdmission: string;
  cardNo: string;
  contactNo: string;
  station?: string | null;
}

interface StudentManagerProps {
  onManageFees?: (student: StudentType) => void;
  selectedSession?: string;
}

const CLASSES_LIST = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12"
];

export default function StudentManager({ onManageFees, selectedSession }: StudentManagerProps) {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stations, setStations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    fatherName: "",
    motherName: "",
    dateOfAdmission: "",
    cardNo: "",
    contactNo: "",
    station: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);


  const fetchStudents = async (query = "", page = 1, cls = selectedClass, sess = selectedSession) => {
    setLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/students`, {
        params: { search: query, page, limit: 10, studentClass: cls, session: sess },
        withCredentials: true
      });
      if (res.data && res.data.students) {
        setStudents(res.data.students);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.totalCount || 0);
          setCurrentPage(res.data.pagination.currentPage || 1);
        } else {
          setTotalPages(1);
          setTotalCount(res.data.students.length);
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchQuery, 1, selectedClass, selectedSession);
  }, [searchQuery, selectedClass, selectedSession]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const res = await axios.get(`${SERVER_URL}/api/erp/stations`, { withCredentials: true });
        if (res.data.success) setStations(res.data.stations);
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    fetchStations();
  }, []);

  const handlePageChange = (page: number) => {
    fetchStudents(searchQuery, page, selectedClass, selectedSession);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      studentClass: "",
      fatherName: "",
      motherName: "",
      dateOfAdmission: "",
      cardNo: "",
      contactNo: "",
      station: ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    try {
      const payload = {
        name: formData.name,
        className: formData.studentClass,
        admissionDate: formData.dateOfAdmission,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        cardNo: formData.cardNo,
        contactNo: formData.contactNo,
        station: formData.station,
        sessionYear: selectedSession,
        initialAmountPaid: 0,
        paymentMode: "CASH"
      };
      await axios.post(`${SERVER_URL}/api/erp/student`, payload, { withCredentials: true });
      setSuccess(`${formData.name} registered successfully!`);
      resetForm();
      setShowForm(false);
      fetchStudents(searchQuery, 1, selectedClass, selectedSession);
    } catch (err: any) {
      console.error("Error in registering student:", err);
      setError(err.response?.data?.message || "Failed to register student. Check if card number is unique.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-[#093C5D]">Student Database</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and register students enrolled at Neelgiri Public School.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); resetForm(); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#093C5D] hover:bg-[#FA6781] text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 shadow-md shadow-[#093C5D]/10"
        >
          {showForm ? <X size={14} /> : <UserPlus size={14} />}
          {showForm ? "Cancel Registration" : "Register New Student"}
        </button>
      </div>


      {/* Expandable Registration Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-black text-[#093C5D] mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-[#FA6781]" />
            Student Admission Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Chetan Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Student Class</label>
                <select
                  required
                  value={formData.studentClass}
                  onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                >
                  <option value="" disabled>Select Class</option>
                  {CLASSES_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Father's Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Mr. Rajesh Sharma"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Mother's Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Mrs. Sunita Sharma"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission Date</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfAdmission}
                  onChange={(e) => setFormData({ ...formData, dateOfAdmission: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Admission / Card No (Unique)</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., NPS-2026-0045"
                  value={formData.cardNo}
                  onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g., 9876543210"
                    value={formData.contactNo}
                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Bus Station (Optional)</label>
                  <select
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D]"
                  >
                    <option value="">None / Day Scholar</option>
                    {stations.map(s => (
                      <option key={s.station} value={s.station}>{s.station}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#59B292] hover:bg-[#489d7f] text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer border-0 shadow-md shadow-[#59B292]/10"
            >
              {submitLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {submitLoading ? "Registering..." : "Add Student"}
            </button>
          </form>
        </div>
      )}

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-700 border-0 bg-transparent cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Student List View */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        {/* Search Filter Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, card, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all font-semibold"
              />
            </div>

            {/* Class filter Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-full sm:w-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#093C5D]">Filter Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Classes</option>
                {CLASSES_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Users size={13} />
            <span className="font-bold">{totalCount}</span> students found
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="animate-spin text-[#093C5D]" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Student Records...</span>
            </div>
          ) : students.length > 0 ? (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Student Details</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Card Number</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Family details</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Admission Date</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Contact</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-5 py-3.5">
                      <p className="font-black text-[#093C5D]">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{student.studentClass}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-500">
                      {student.cardNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-500 font-medium">F: {student.fatherName}</p>
                      <p className="text-slate-400 text-[11px]">M: {student.motherName}</p>
                    </td>
                    <td className="px-5 py-3.5 flex items-center gap-1.5 text-slate-400 font-medium">
                      <Calendar size={12} />
                      {new Date(student.dateOfAdmission).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-600">
                      {student.contactNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onManageFees?.(student)}
                        title="Manage Fees"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#14B8A6] hover:bg-[#FA6781] text-white rounded-xl text-[10px] font-bold transition duration-200 cursor-pointer border-0 shadow-sm shadow-[#14B8A6]/10"
                      >
                        <CreditCard size={12} />
                        Manage Fees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-slate-400 italic">
              No students found matching your search.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/30 text-xs text-slate-500">
            <div>
              Showing <span className="font-bold">{(currentPage - 1) * 10 + 1}</span> to{" "}
              <span className="font-bold">{Math.min(currentPage * 10, totalCount)}</span> of{" "}
              <span className="font-bold">{totalCount}</span> records
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#093C5D]/30 disabled:opacity-50 disabled:hover:border-slate-200 font-bold rounded-lg transition duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, arr) => {
                  return (
                    <React.Fragment key={p}>
                      {index > 0 && arr[index - 1] !== p - 1 && <span className="px-1 text-slate-400">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-1.5 border rounded-lg font-bold transition duration-150 cursor-pointer ${
                          currentPage === p
                            ? "bg-[#093C5D] text-white border-[#093C5D] shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:border-[#093C5D]/30"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#093C5D]/30 disabled:opacity-50 disabled:hover:border-slate-200 font-bold rounded-lg transition duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
