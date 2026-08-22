import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  Hourglass,
  Plus,
  ShieldCheck,
  ShieldOff,
  Pencil,
  Check,
  X,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

// ---- Leave type quotas (annual entitlement per type) ----
const DEFAULT_QUOTAS = {
  Casual: 12,
  Sick: 8,
  Earned: 15,
};

const TYPE_META = {
  Casual: { icon: CalendarClock, accent: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  Sick: { icon: Hourglass, accent: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-500" },
  Earned: { icon: CalendarCheck2, accent: "text-teal-600", bg: "bg-teal-50", bar: "bg-teal-500" },
};

const STATUS_STYLES = {
  Approved: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  Pending: { icon: Clock3, cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  Rejected: { icon: XCircle, cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" },
};

const INITIAL_HISTORY = [
  {
    id: "LR-2041",
    type: "Casual",
    from: "2026-08-03",
    to: "2026-08-04",
    days: 2,
    status: "Approved",
  },
  {
    id: "LR-2052",
    type: "Sick",
    from: "2026-08-12",
    to: "2026-08-12",
    days: 1,
    status: "Approved",
  },
  {
    id: "LR-2061",
    type: "Earned",
    from: "2026-09-01",
    to: "2026-09-05",
    days: 5,
    status: "Pending",
  },
  {
    id: "LR-2070",
    type: "Casual",
    from: "2026-06-10",
    to: "2026-06-10",
    days: 1,
    status: "Rejected",
  },
];

function calcDays(from, to) {
  if (!from || !to) return 0;
  const start = new Date(from);
  const end = new Date(to);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function BalanceCard({ type, quota, used }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  const remaining = Math.max(quota - used, 0);
  const pct = Math.min(Math.round((used / quota) * 100), 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bg}`}>
          <Icon className={`h-5 w-5 ${meta.accent}`} />
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {used} / {quota} used
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{type} Leave</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {remaining} <span className="text-sm font-normal text-slate-400">days left</span>
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function LeaveManagementPage() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ type: "Casual", from: "", to: "" });

  // Approved days used per leave type, for balance cards
  const usedByType = useMemo(() => {
    const totals = { Casual: 0, Sick: 0, Earned: 0 };
    history.forEach((req) => {
      if (req.status === "Approved") totals[req.type] += req.days;
    });
    return totals;
  }, [history]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Not tied to a native <form onSubmit>, so it can't be swallowed by a
  // parent <form> element or a missing preventDefault. Called directly
  // from the button's onClick.
  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!form.from || !form.to) {
      setError("Please select both a start and end date.");
      return;
    }

    const days = calcDays(form.from, form.to);
    if (days <= 0) {
      setError("End date cannot be before the start date.");
      return;
    }

    const remaining = DEFAULT_QUOTAS[form.type] - usedByType[form.type];
    if (days > remaining) {
      setError(`Only ${remaining} ${form.type} leave day(s) remaining.`);
      return;
    }

    const newRequest = {
      id: `LR-${Math.floor(2000 + Math.random() * 9000)}`,
      type: form.type,
      from: form.from,
      to: form.to,
      days,
      status: "Pending",
    };

    setHistory((prev) => [newRequest, ...prev]);
    setForm({ type: "Casual", from: "", to: "" });
    setSuccess(`Request submitted — ${days} day(s) of ${newRequest.type} leave, pending approval.`);

    // Keep the form open briefly so the success message is visible,
    // then collapse it.
    setTimeout(() => {
      setShowForm(false);
      setSuccess("");
    }, 1800);
  };

  const handleDecision = (id, status) => {
    setHistory((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Leave Management</h1>
              <p className="text-sm text-slate-500">
                {isAdmin ? "Admin view — approve or reject requests" : "Track balances and apply for time off"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdmin((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              isAdmin
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100"
            }`}
          >
            {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
            {isAdmin ? "Admin mode on" : "Admin mode off"}
          </button>
        </div>

        {/* Balance summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.keys(DEFAULT_QUOTAS).map((type) => (
            <BalanceCard key={type} type={type} quota={DEFAULT_QUOTAS[type]} used={usedByType[type]} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Apply for Leave */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-teal-600" />
                  <h2 className="text-base font-semibold text-slate-900">Apply for Leave</h2>
                </div>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                    New Request
                  </button>
                )}
              </div>

              {showForm ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Leave Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    >
                      {Object.keys(DEFAULT_QUOTAS).map((type) => (
                        <option key={type} value={type}>
                          {type} Leave
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
                      <input
                        type="date"
                        name="from"
                        value={form.from}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
                      <input
                        type="date"
                        name="to"
                        value={form.to}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  {form.from && form.to && calcDays(form.from, form.to) > 0 && (
                    <p className="text-xs text-slate-500">
                      {calcDays(form.from, form.to)} day(s) requested
                    </p>
                  )}

                  {error && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">
                      {success}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setError("");
                        setSuccess("");
                      }}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 ring-1 ring-slate-300 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Click "New Request" to apply for leave.
                </p>
              )}
            </div>
          </div>

          {/* Leave request history */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-semibold text-slate-900">Leave Request History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">From</th>
                      <th className="pb-3 pr-4 font-medium">To</th>
                      <th className="pb-3 pr-4 font-medium">Days</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      {isAdmin && <th className="pb-3 font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((req) => (
                      <tr key={req.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-500">{req.id}</td>
                        <td className="py-3 pr-4 font-medium text-slate-800">{req.type}</td>
                        <td className="py-3 pr-4 text-slate-600">
                          {new Date(req.from).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {new Date(req.to).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{req.days}</td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={req.status} />
                        </td>
                        {isAdmin && (
                          <td className="py-3">
                            {req.status === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecision(req.id, "Approved")}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDecision(req.id, "Rejected")}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100"
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : editingId === req.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecision(req.id, "Approved")}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  title="Mark approved"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDecision(req.id, "Rejected")}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100"
                                  title="Mark rejected"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingId(req.id)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                title="Edit status"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 7 : 6} className="py-6 text-center text-slate-400">
                          No leave requests yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

