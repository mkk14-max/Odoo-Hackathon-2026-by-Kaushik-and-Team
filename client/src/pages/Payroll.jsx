import React, { useState, useMemo } from "react";
import {
  Wallet,
  BadgeIndianRupee,
  MinusCircle,
  Landmark,
  Download,
  ShieldCheck,
  ShieldOff,
  Pencil,
  Check,
  X,
  TrendingUp,
  Building2,
} from "lucide-react";

// ---- Payroll calculation constants (percentages applied to Base Pay) ----
const HRA_RATE = 0.4; // House Rent Allowance
const SPECIAL_ALLOWANCE_RATE = 0.2; // Special Allowance
const PF_RATE = 0.12; // Provident Fund (employee contribution)

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

// Simple progressive tax slab applied on gross salary (illustrative only)
function computeTax(gross) {
  if (gross <= 50000) return gross * 0.03;
  if (gross <= 100000) return 1500 + (gross - 50000) * 0.08;
  return 5500 + (gross - 100000) * 0.15;
}

export default function PayrollPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [basePay, setBasePay] = useState(60000);
  const [draftBasePay, setDraftBasePay] = useState(String(basePay));
  const [isEditing, setIsEditing] = useState(false);

  const employee = {
    name: "Ananya Rao",
    id: "EMP-10492",
    designation: "Senior Product Analyst",
    department: "Operations",
    payPeriod: "August 2026",
  };

  const breakdown = useMemo(() => {
    const hra = basePay * HRA_RATE;
    const specialAllowance = basePay * SPECIAL_ALLOWANCE_RATE;
    const gross = basePay + hra + specialAllowance;
    const pf = basePay * PF_RATE;
    const tax = computeTax(gross);
    const totalDeductions = pf + tax;
    const netPay = gross - totalDeductions;

    return {
      basePay,
      hra,
      specialAllowance,
      gross,
      pf,
      tax,
      totalDeductions,
      netPay,
    };
  }, [basePay]);

  const rows = [
    { label: "Base Pay", value: breakdown.basePay, type: "earning" },
    { label: "House Rent Allowance (HRA)", value: breakdown.hra, type: "earning" },
    { label: "Special Allowance", value: breakdown.specialAllowance, type: "earning" },
    { label: "Provident Fund (PF)", value: breakdown.pf, type: "deduction" },
    { label: "Income Tax (TDS)", value: breakdown.tax, type: "deduction" },
  ];

  const summaryCards = [
    {
      label: "Net Pay",
      value: breakdown.netPay,
      icon: Wallet,
      tint: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      iconTint: "bg-emerald-600",
    },
    {
      label: "Gross Salary",
      value: breakdown.gross,
      icon: BadgeIndianRupee,
      tint: "bg-indigo-50 text-indigo-700 ring-indigo-100",
      iconTint: "bg-indigo-600",
    },
    {
      label: "Total Deductions",
      value: breakdown.totalDeductions,
      icon: MinusCircle,
      tint: "bg-rose-50 text-rose-700 ring-rose-100",
      iconTint: "bg-rose-600",
    },
    {
      label: "Tax Withheld",
      value: breakdown.tax,
      icon: Landmark,
      tint: "bg-amber-50 text-amber-700 ring-amber-100",
      iconTint: "bg-amber-600",
    },
  ];

  const handleSaveBasePay = () => {
    const parsed = parseFloat(draftBasePay);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setBasePay(parsed);
    } else {
      setDraftBasePay(String(basePay));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftBasePay(String(basePay));
    setIsEditing(false);
  };

  const handleDownloadPayslip = () => {
    const lines = [
      `Payslip - ${employee.payPeriod}`,
      `Employee: ${employee.name} (${employee.id})`,
      `Designation: ${employee.designation}`,
      `Department: ${employee.department}`,
      "",
      ...rows.map(
        (r) => `${r.label}: ${r.type === "deduction" ? "-" : ""}${formatCurrency(r.value)}`
      ),
      "",
      `Gross Salary: ${formatCurrency(breakdown.gross)}`,
      `Total Deductions: -${formatCurrency(breakdown.totalDeductions)}`,
      `Net Pay: ${formatCurrency(breakdown.netPay)}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip-${employee.id}-${employee.payPeriod.replace(" ", "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Payroll
              </h1>
              <p className="text-sm text-slate-500">
                {employee.name} &middot; {employee.designation} &middot;{" "}
                {employee.payPeriod}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* HR Admin toggle */}
            <button
              type="button"
              onClick={() => setIsAdmin((prev) => !prev)}
              aria-pressed={isAdmin}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                isAdmin
                  ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )}
              {isAdmin ? "HR Admin Mode: On" : "HR Admin Mode: Off"}
            </button>

            {/* Download payslip */}
            <button
              type="button"
              onClick={handleDownloadPayslip}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Download Payslip
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, tint, iconTint }) => (
            <div
              key={label}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-inset ${tint}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {label}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${iconTint}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">
                {formatCurrency(value)}
              </p>
            </div>
          ))}
        </div>

        {/* HR Admin: edit base salary */}
        {isAdmin && (
          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                  <TrendingUp className="h-4 w-4" />
                  Edit Base Salary
                </h2>
                <p className="mt-1 text-xs text-indigo-700">
                  Adjusting Base Pay recalculates HRA, Special Allowance, PF,
                  and Tax automatically.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={draftBasePay}
                        onChange={(e) => setDraftBasePay(e.target.value)}
                        className="w-40 rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveBasePay}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold tabular-nums text-slate-900 shadow-sm">
                      {formatCurrency(basePay)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Salary breakdown table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Monthly Salary Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Pay period: {employee.payPeriod}
            </p>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Component</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {row.label}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.type === "earning"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {row.type === "earning" ? "Earning" : "Deduction"}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-right tabular-nums font-medium ${
                      row.type === "deduction"
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    {row.type === "deduction" ? "-" : ""}
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td className="px-5 py-3 font-semibold text-slate-900" colSpan={2}>
                  Net Pay
                </td>
                <td className="px-5 py-3 text-right text-base font-semibold tabular-nums text-emerald-700">
                  {formatCurrency(breakdown.netPay)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

