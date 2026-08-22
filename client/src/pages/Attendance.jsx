import React, { useState, useEffect, useMemo } from "react";
import {
  Sun,
  LogIn,
  LogOut,
  MapPin,
  CalendarCheck,
  Clock,
  TrendingUp,
  Users,
  User,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";

/**
 * Dayflow HRMS — Attendance Tracking Dashboard
 * Self-contained functional component. Tailwind CSS + lucide-react.
 */
export default function DayflowAttendanceTracking() {
  const [status, setStatus] = useState("out"); // "out" | "in"
  const [checkInTime, setCheckInTime] = useState(null);
  const [now, setNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("employee"); // "employee" | "admin"

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggle = () => {
    if (status === "out") {
      setStatus("in");
      setCheckInTime(new Date());
    } else {
      setStatus("out");
      setCheckInTime(null);
    }
  };

  const formatTime = (d) =>
    d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

  const elapsed = () => {
    if (!checkInTime) return "0h 0m";
    const diffMs = now - checkInTime;
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const metrics = [
    {
      label: "Days Present",
      value: "21 / 23",
      icon: CalendarCheck,
      note: "This month",
    },
    {
      label: "Hours Logged",
      value: "168.4 hrs",
      icon: Clock,
      note: "This month",
    },
    {
      label: "On-Time Arrival",
      value: "92%",
      icon: TrendingUp,
      note: "Last 30 days",
    },
  ];

  const employeeLog = [
    { date: "Fri, Aug 22, 2026", in: "09:12 AM", out: "06:04 PM", hours: "8h 52m", status: "Present" },
    { date: "Thu, Aug 21, 2026", in: "09:41 AM", out: "01:30 PM", hours: "3h 49m", status: "Half-Day" },
    { date: "Wed, Aug 20, 2026", in: "08:58 AM", out: "05:59 PM", hours: "9h 01m", status: "Present" },
    { date: "Tue, Aug 19, 2026", in: "—", out: "—", hours: "0h 00m", status: "Absent" },
    { date: "Mon, Aug 18, 2026", in: "09:05 AM", out: "06:12 PM", hours: "9h 07m", status: "Present" },
  ];

  const adminLog = [
    { employee: "Aisha Rao", date: "Fri, Aug 22, 2026", in: "09:02 AM", out: "06:00 PM", hours: "8h 58m", status: "Present" },
    { employee: "Marcus Ellis", date: "Fri, Aug 22, 2026", in: "09:47 AM", out: "06:10 PM", hours: "8h 23m", status: "Present" },
    { employee: "Priya Nair", date: "Fri, Aug 22, 2026", in: "—", out: "—", hours: "0h 00m", status: "Absent" },
    { employee: "Daniel Osei", date: "Fri, Aug 22, 2026", in: "09:15 AM", out: "01:20 PM", hours: "4h 05m", status: "Half-Day" },
    { employee: "Wei Chen", date: "Fri, Aug 22, 2026", in: "08:54 AM", out: "05:58 PM", hours: "9h 04m", status: "Present" },
  ];

  const statusStyles = {
    Present: {
      icon: CheckCircle2,
      classes: "text-[#2F7A56] bg-[#EAF4EE] border-[#CFE6D8]",
    },
    "Half-Day": {
      icon: MinusCircle,
      classes: "text-[#B4740E] bg-[#FCF3E1] border-[#F2D9A8]",
    },
    Absent: {
      icon: XCircle,
      classes: "text-[#B3402F] bg-[#FBEAE7] border-[#F0CBC3]",
    },
  };

  const isAdmin = viewMode === "admin";
  const rows = useMemo(() => (isAdmin ? adminLog : employeeLog), [isAdmin]);

  return (
    <div className="min-h-screen w-full bg-[#FBFAF7] font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 py-10 font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#F2A93B]">
              <Sun className="w-5 h-5 text-[#14213D]" strokeWidth={2.25} />
            </span>
            <div>
              <p className="font-display text-lg text-[#14213D] tracking-tight leading-tight">
                Dayflow <span className="font-normal opacity-60">HRMS</span>
              </p>
              <p className="text-[13px] text-[#6B7280] -mt-0.5">
                Attendance Tracking
              </p>
            </div>
          </div>

          {/* Admin / Employee toggle */}
          <div className="relative grid grid-cols-2 bg-[#F1EEE6] rounded-xl p-1 w-full sm:w-[280px]">
            <span
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-[#E5E1D8] transition-transform duration-300 ease-out ${
                !isAdmin ? "translate-x-0" : "translate-x-[calc(100%+8px)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setViewMode("employee")}
              className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                !isAdmin ? "text-[#14213D]" : "text-[#9A9488]"
              }`}
            >
              <User className="w-4 h-4" />
              Employee
            </button>
            <button
              type="button"
              onClick={() => setViewMode("admin")}
              className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                isAdmin ? "text-[#14213D]" : "text-[#9A9488]"
              }`}
            >
              <Users className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Check-in / check-out card */}
          <div className="lg:col-span-1 rounded-xl border border-[#E5E1D8] bg-[#14213D] px-6 py-7 text-center relative overflow-hidden">
            <svg
              className="absolute -bottom-16 -right-14 opacity-40"
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
            >
              <circle
                cx="110"
                cy="110"
                r="95"
                stroke="#F2A93B"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                opacity="0.4"
              />
            </svg>

            <div className="relative z-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-[#F2A93B] font-medium mb-2">
                {now.toLocaleDateString([], {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="font-display text-[2.4rem] leading-none text-white font-medium tabular-nums mb-2">
                {now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#9AA2B5] mb-5">
                <MapPin className="w-3.5 h-3.5" />
                Bengaluru Office · Verified
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/[0.06] border border-white/10 px-4 py-3 mb-4 text-left">
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {status === "in" ? "Checked in" : "Not checked in"}
                  </p>
                  <p className="text-[12px] text-[#9AA2B5]">
                    {status === "in"
                      ? `Since ${formatTime(checkInTime)} · ${elapsed()}`
                      : "Shift hasn't started"}
                  </p>
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === "in" ? "bg-[#4ADE80]" : "bg-[#6B7280]"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  status === "in"
                    ? "bg-[#E8622C] text-white hover:bg-[#D2551F]"
                    : "bg-[#F2A93B] text-[#14213D] hover:bg-[#E89B26]"
                }`}
              >
                {status === "in" ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    Check Out
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Check In
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metric cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {metrics.map(({ label, value, icon: Icon, note }) => (
              <div
                key={label}
                className="rounded-xl border border-[#E5E1D8] bg-white px-5 py-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-[#FBF7EE] border border-[#F2E4C4]">
                    <Icon className="w-4 h-4 text-[#B4740E]" strokeWidth={2} />
                  </span>
                </div>
                <p className="font-display text-[1.7rem] text-[#14213D] font-medium leading-none mb-1.5">
                  {value}
                </p>
                <p className="text-[13px] font-medium text-[#374151]">
                  {label}
                </p>
                <p className="text-[12px] text-[#9A9488] mt-0.5">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance log table */}
        <div className="rounded-xl border border-[#E5E1D8] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E1D8] flex items-center justify-between">
            <h3 className="font-display text-[1.1rem] text-[#14213D] font-medium">
              {isAdmin ? "Team attendance log" : "Your attendance log"}
            </h3>
            <span className="text-[12px] text-[#9A9488]">
              {isAdmin ? "All employees · Today" : "Last 5 working days"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[12px] uppercase tracking-wide text-[#9A9488] bg-[#FAF8F3]">
                  {isAdmin && <th className="px-5 py-3 font-medium">Employee</th>}
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Check-In</th>
                  <th className="px-5 py-3 font-medium">Check-Out</th>
                  <th className="px-5 py-3 font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const StatusIcon = statusStyles[row.status].icon;
                  return (
                    <tr
                      key={idx}
                      className="border-t border-[#F0EDE4] hover:bg-[#FAF8F3] transition-colors"
                    >
                      {isAdmin && (
                        <td className="px-5 py-3.5 font-medium text-[#14213D] whitespace-nowrap">
                          {row.employee}
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-[#374151] whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280] whitespace-nowrap">
                        {row.in}
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280] whitespace-nowrap">
                        {row.out}
                      </td>
                      <td className="px-5 py-3.5 text-[#374151] whitespace-nowrap">
                        {row.hours}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border ${
                            statusStyles[row.status].classes
                          }`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
