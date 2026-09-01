import { StudentType, FeeStructureType } from "./types";

const MONTH_ORDER = ["April","May","June","July","August","September","October","November","December","January","February","March"];

const fmt = (v: string | number) => Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export function printInvoice(student: StudentType, fee: any, allFees: any[]) {
  const origin = window.location.origin;
  
  let iframe = document.getElementById("print-invoice-iframe") as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "print-invoice-iframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);
  }

  const win = iframe.contentWindow;
  if (!win) { alert("Print preview is not supported in this browser."); return; }

  const parseMonthStr = (str: string) => {
    const [mName, year] = str.split("-");
    return new Date(`${mName} 1, ${year}`);
  };

  const sortedAllFees = [...allFees].sort((a, b) => {
    return parseMonthStr(a.month).getTime() - parseMonthStr(b.month).getTime();
  });

  const currentMonthDate = parseMonthStr(fee.month);

  let activePreviousBalance = 0;
  for (const f of sortedAllFees) {
    if (parseMonthStr(f.month) < currentMonthDate) {
      const fPaid = f.payments?.reduce((s: number, p: any) => s + (Number(p.amountPaid) || 0), 0) ?? 0;
      const prevSessionDues = Number(f.previousSessionDues || 0);
      const fRemaining = Math.round((Number(f.total || f.totalDemand || 0) - prevSessionDues - fPaid) * 100) / 100;
      activePreviousBalance = Math.round((activePreviousBalance + prevSessionDues + fRemaining) * 100) / 100;
    }
  }
  const currentPrevSessionDues = Number(fee.previousSessionDues || 0);
  activePreviousBalance = Math.round((activePreviousBalance + currentPrevSessionDues) * 100) / 100;

 
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const activeTotal = Number(fee.total || fee.totalDemand || 0) - currentPrevSessionDues;
  const grossTotal = Math.round((activeTotal + activePreviousBalance) * 100) / 100;

  const feePaid = fee.payments?.reduce((s: number, p: any) => s + (Number(p.amountPaid) || 0), 0) ?? 0;
  const netRemaining = Math.round((grossTotal - feePaid) * 100) / 100;

  // Current month breakdown rows (non-zero heads only)
  const headRows = [
    ["Admission Fee",       fee.admissionFee],
    ["Tuition Fee",         fee.tuitionFee],
    ["Exam Fee",            fee.examFee],
    ["School Bus Charges",  fee.schoolBusCharges],
    ["PTM Fine",            fee.ptmFine],
    ["Computer Fee",        fee.computerFee],
    ["Tie, Belt & Books",   fee.tieBeltBooks],
    ["Building Fund",       fee.buildingFund],
    ["Annual Charges",      fee.annualCharges],
    ["Previous Balance",    activePreviousBalance],
  ]
    .filter(([, v]) => Number(v) > 0)
    .map(([n, v]) => `<tr><td>${n}</td><td class="r">Rs. ${fmt(v as string)}</td></tr>`)
    .join("");

  // Calculate running balances for all history fees
  let runningDues = 0;
  const historyWithBalances = sortedAllFees.map((h: any) => {
    const paid = h.payments?.reduce((s: number, p: any) => s + (Number(p.amountPaid) || 0), 0) ?? 0;
    const prevSessionDues = Number(h.previousSessionDues || 0);
    const actualTotal = Number(h.total || h.totalDemand || 0) - prevSessionDues;
    const currentRemaining = Math.round((actualTotal - paid) * 100) / 100;
    const prevRemaining = runningDues + prevSessionDues;
    runningDues = Math.round((runningDues + prevSessionDues + currentRemaining) * 100) / 100;
    
    return {
      ...h,
      paid,
      actualTotal,
      currentRemaining,
      prevRemaining,
      totalBalance: runningDues
    };
  });

  const historyToRender = historyWithBalances.slice(-6);

  // History rows (up to 6 months)
  const histRows = historyToRender.map(h => {
    const bg   = h.status === "PAID" ? "#dcfce7" : h.status === "PARTIALLY_PAID" ? "#fef3c7" : "#fee2e2";
    const fg   = h.status === "PAID" ? "#15803d" : h.status === "PARTIALLY_PAID" ? "#b45309" : "#b91c1c";
    const label = h.status === "PAID" ? "Settled" : h.status === "PARTIALLY_PAID" ? "Partial" : "Pending";
    return `<tr>
      <td>${h.month}</td>
      <td class="r">Rs. ${fmt(h.actualTotal)}</td>
      <td class="r">Rs. ${fmt(h.paid)}</td>
      <td class="r">Rs. ${fmt(h.prevRemaining)}</td>
      <td class="r" style="color:${h.currentRemaining > 0 ? "#b91c1c" : "#15803d"}">Rs. ${fmt(h.currentRemaining)}</td>
      <td class="r" style="font-weight:bold;color:${h.totalBalance > 0 ? "#b91c1c" : "#15803d"}">Rs. ${fmt(h.totalBalance)}</td>
      <td class="c"><span style="background:${bg};color:${fg};padding:2px 8px;border-radius:4px;font-size:9px;font-weight:800">${label}</span></td>
    </tr>`;
  }).join("");

  const totalOverallRemaining = runningDues;

  win.document.write(`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>Receipt · ${student.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;color:#1e293b;font-size:11px;line-height:1.4;padding:22px 28px}
  /* ── Header ── */
  .hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #093C5D;padding-bottom:12px;margin-bottom:14px}
  .hdr-left{display:flex;align-items:center;gap:12px}
  .logo{width:54px;height:54px;border-radius:50%;object-fit:contain;border:2px solid #e2e8f0}
  .school-name{font-size:16px;font-weight:900;color:#093C5D;text-transform:uppercase;letter-spacing:0.4px}
  .school-sub{font-size:9px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-top:2px}
  .school-contact{font-size:9px;color:#94a3b8;margin-top:2px}
  .receipt-block{text-align:right}
  .receipt-label{font-size:22px;font-weight:900;color:#14B8A6;text-transform:uppercase;letter-spacing:1px}
  .receipt-meta{font-size:9.5px;color:#475569;margin-top:4px;line-height:1.7}
  /* ── Student + Fee Info grid ── */
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
  .info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px}
  .info-title{font-size:9px;font-weight:900;text-transform:uppercase;color:#475569;border-bottom:1px solid #e2e8f0;padding-bottom:5px;margin-bottom:7px;letter-spacing:0.6px}
  .info-row{display:flex;justify-content:space-between;margin-bottom:4px}
  .info-label{color:#64748b;font-weight:600}
  .info-val{font-weight:700;color:#0f172a}
  /* ── Tables ── */
  .sec{font-size:9.5px;font-weight:900;text-transform:uppercase;color:#093C5D;border-bottom:2px solid #093C5D;padding-bottom:4px;margin:12px 0 6px;letter-spacing:0.4px}
  table{width:100%;border-collapse:collapse;margin-bottom:10px}
  th{background:#093C5D;color:#fff;padding:6px 8px;font-size:9px;text-transform:uppercase;font-weight:700;border:1px solid #093C5D}
  td{padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:10.5px}
  .r{text-align:right} .c{text-align:center}
  .total-row td{background:#f1f5f9;font-weight:900;border-top:2px solid #093C5D;font-size:11px}
  tr:last-child td{border-bottom:none}
  /* ── Footer ── */
  .footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;padding-top:10px;border-top:1px dashed #cbd5e1}
  .terms{font-size:9px;color:#64748b;max-width:360px;line-height:1.6}
  .sig{text-align:center;width:150px}
  .sig-line{border-top:1px dashed #94a3b8;margin-bottom:5px}
  .sig-name{font-size:10px;font-weight:800;color:#0f172a}
  .sig-role{font-size:8.5px;color:#64748b;margin-top:1px}
  /* ── Print button ── */
  @media print{body{padding:14px 18px}}
</style>
</head><body>
 
<!-- HEADER -->
<div class="hdr">
  <div class="hdr-left">
    <img class="logo" src="${origin}/school_logo.png" alt="NPS Logo">
    <div>
      <div class="school-name">Neelgiri Public School</div>
      <div class="school-sub">Hatwas, Nagrota Bagwan, Himachal Pradesh – 176047</div>
      <div class="school-contact">info@neelgiripublicschool.in &nbsp;|&nbsp; +91 98160 73096 &nbsp;|&nbsp; www.neelgiripublicschool.in</div>
    </div>
  </div>
  <div class="receipt-block">
    <div class="receipt-label">Fee Receipt</div>
    <div class="receipt-meta">
      
      Date: <strong>${today}</strong><br>
      Billing Period: <strong>${fee.month}</strong>
    </div>
  </div>
</div>

<!-- STUDENT + FEE INFO -->
<div class="info-grid">
  <div class="info-box">
    <div class="info-title">Student Details</div>
    <div class="info-row"><span class="info-label">Name</span><span class="info-val">${student.name}</span></div>
    <div class="info-row"><span class="info-label">Class</span><span class="info-val">${(student as any).studentclass?.className || fee.studentClass || "N/A"}</span></div>
    <div class="info-row"><span class="info-label">Roll No.</span><span class="info-val" style="font-family:monospace;color:#093C5D">${student.cardNo}</span></div>
    <div class="info-row"><span class="info-label">Father</span><span class="info-val">${student.fatherName || "N/A"}</span></div>
  </div>
  <div class="info-box">
    <div class="info-title">Receipt Summary</div>
    <div class="info-row"><span class="info-label">Contact</span><span class="info-val">${student.contactNo || "N/A"}</span></div>
    <div class="info-row"><span class="info-label">Current Dues</span><span class="info-val">Rs. ${fmt(activeTotal)}</span></div>
    <div class="info-row"><span class="info-label">Previous Arrears</span><span class="info-val">Rs. ${fmt(activePreviousBalance)}</span></div>
    <div class="info-row"><span class="info-label">Total Amount Due</span><span class="info-val" style="color:#093C5D;font-weight:700">Rs. ${fmt(grossTotal)}</span></div>
    <div class="info-row"><span class="info-label">Amount Paid</span><span class="info-val" style="color:#15803d;font-weight:700">Rs. ${fmt(feePaid)}</span></div>
    <div class="info-row"><span class="info-label">Net Balance Remaining</span><span class="info-val" style="color:#b91c1c;font-weight:900">Rs. ${fmt(netRemaining)}</span></div>
  </div>
</div>

<!-- CURRENT MONTH BREAKDOWN -->
<div class="sec">Current Period Breakdown — ${fee.month}</div>
<table>
  <thead><tr><th>Fee Head</th><th class="r">Amount</th></tr></thead>
  <tbody>
    ${headRows}
    <tr class="total-row"><td>Total Amount Due</td><td class="r">Rs. ${fmt(grossTotal)}</td></tr>
  </tbody>
</table>

<!-- FEE HISTORY (up to 6 months) -->
<div class="sec">Academic Year Statement (Last ${historyToRender.length} Months)</div>
<table>
  <thead>
    <tr>
      <th>Month</th>
      <th class="r">Total</th>
      <th class="r">Paid</th>
      <th class="r">Prev Bal</th>
      <th class="r">Current Bal</th>
      <th class="r">Total Bal</th>
      <th class="c">Status</th>
    </tr>
  </thead>
  <tbody>
    ${histRows}
    <tr>
      <td colspan="5" class="r" style="border-bottom: none; padding-top: 10px; font-weight: 900; color: #093C5D; font-size: 11px;">Total Overall Remaining Balance</td>
      <td class="r" style="border-bottom: none; border-top: 2px solid #093C5D; padding-top: 10px; font-weight: 900; font-size: 11.5px; color: ${totalOverallRemaining > 0 ? '#b91c1c' : '#15803d'};">Rs. ${fmt(totalOverallRemaining)}</td>
      <td style="border-bottom: none; border-top: 2px solid #093C5D; padding-top: 10px;"></td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div class="footer">
  <div class="terms">
    <strong>Terms & Conditions:</strong><br>
    1. This is an official receipt of Neelgiri Public School, Lower Hatwas.<br>
    2. Unpaid balances carry forward automatically to the next billing month.<br>
    3. For disputes, contact the accounts office within 7 days of receipt.
  </div>
  <div class="sig">
    <div class="sig-line"></div>
    <div class="sig-name">Accounts Officer</div>
    <div class="sig-role">Neelgiri Public School</div>
  </div>
</div>

</body></html>`);
  win.document.close();

  const img = win.document.querySelector(".logo") as HTMLImageElement;
  if (img && !img.complete) {
    img.onload = () => {
      win.focus();
      win.print();
    };
  } else {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 250);
  }
}
