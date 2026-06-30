export interface StudentType {
  id: string;
  name: string;
  studentClass: string;
  cardNo: string;
  fatherName?: string;
  motherName?: string;
  contactNo?: string;
  station?: string | null;
}


export interface PaymentType {
  id: string;
  amountPaid: string | number;
  paymentMode: "CASH" | "UPI";
  date: string;
}

export interface FeeStructureType {
  id: string;
  month: string;
  admissionFee: string | number;
  tuitionFee: string | number;
  examFee: string | number;
  schoolBusCharges: string | number;
  ptmFine: string | number;
  computerFee: string | number;
  tieBeltBooks: string | number;
  buildingFund: string | number;
  annualCharges: string | number;
  previousBalance: string | number;
  previousSessionDues?: string | number;
  totalDemand: string | number;
  total: string | number;
  status: "PENDING" | "PARTIALLY_PAID" | "PAID";
  payments?: PaymentType[];
  createdAt: string;
}

export const CLASSES = [
  "All",
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12"
];

export const getAcademicYearMonths = (): string[] => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed: 0 = Jan, 11 = Dec
  const currentYear = now.getFullYear();
  
  // If we are in Jan, Feb, or March, the academic year started in April of the previous year.
  // Otherwise, it started in April of the current year.
  const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  
  const months = [
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December", "January", "February", "March"
  ];
  
  return months.map((m, index) => {
    const year = index < 9 ? startYear : startYear + 1;
    return `${m}-${year}`;
  });
};

export const getCurrentMonthStr = (): string => {
  const now = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[now.getMonth()]}-${now.getFullYear()}`;
};

export const SESSIONS = ["2025-2026", "2026-2027", "2027-2028", "2028-2029"];

export const getMonthsForSession = (session: string): string[] => {
  const startYear = parseInt(session.split("-")[0], 10);
  const months = [
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December", "January", "February", "March"
  ];
  return months.map((m, index) => {
    const year = index < 9 ? startYear : startYear + 1;
    return `${m}-${year}`;
  });
};
