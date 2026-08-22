import React, { useState } from "react";
import {
  Mail,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Clock,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Sun,
} from "lucide-react";

/**
 * Dayflow HRMS — Authentication Page
 * Self-contained functional component. Tailwind CSS + lucide-react.
 */
export default function DayflowAuth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Employee");
  const [roleOpen, setRoleOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    employeeId: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ mode, role, ...form });
  };

  const features = [
    {
      icon: Clock,
      title: "Clock in, wherever you are",
      desc: "Track hours and attendance without the paperwork.",
    },
    {
      icon: CalendarCheck,
      title: "Leave, approved in a day",
      desc: "Request time off and see team availability instantly.",
    },
    {
      icon: Wallet,
      title: "Payroll you can trust",
      desc: "Payslips, taxes, and reimbursements, always on time.",
    },
    {
      icon: ShieldCheck,
      title: "Records, kept safe",
      desc: "Role-based access keeps sensitive data protected.",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-stretch bg-[#FBFAF7] font-[Inter,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* ---------- LEFT: Brand banner ---------- */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-[#14213D] font-body">
        {/* Arc / sunrise signature */}
        <svg
          className="absolute -bottom-24 -left-16 opacity-90"
          width="620"
          height="620"
          viewBox="0 0 620 620"
          fill="none"
        >
          <defs>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F2A93B" />
              <stop offset="100%" stopColor="#E8622C" />
            </linearGradient>
          </defs>
          <circle
            cx="310"
            cy="310"
            r="260"
            stroke="url(#arcGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 10"
            opacity="0.35"
          />
          <path
            d="M 60 310 A 250 250 0 0 1 560 310"
            stroke="url(#arcGradient)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
          <circle cx="392" cy="146" r="7" fill="#F2A93B" />
        </svg>

        <div className="relative z-10 flex flex-col justify-between h-full w-full px-12 py-14 text-[#F5F3EC]">
          {/* Wordmark */}
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#F2A93B]">
              <Sun className="w-5 h-5 text-[#14213D]" strokeWidth={2.25} />
            </span>
            <span className="font-display text-xl tracking-tight">
              Dayflow <span className="font-normal opacity-70">HRMS</span>
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-md">
            <p className="uppercase text-[11px] tracking-[0.25em] text-[#F2A93B] mb-4 font-medium">
              Every workday, in flow
            </p>
            <h1 className="font-display text-[2.6rem] leading-[1.08] font-medium mb-5">
              One place to run the
              <br />
              working day.
            </h1>
            <p className="text-[#C9CEDA] text-[15px] leading-relaxed">
              From clock-in to payday, Dayflow keeps your team's time,
              leave, and records moving — quietly, accurately, on schedule.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid place-items-center w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 shrink-0">
                  <Icon className="w-4 h-4 text-[#F2A93B]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#F5F3EC]">
                    {title}
                  </p>
                  <p className="text-[13px] text-[#9AA2B5] leading-snug">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-[12px] text-[#6E7690]">
            © {new Date().getFullYear()} Dayflow HRMS. Built for people teams.
          </p>
        </div>
      </div>

      {/* ---------- RIGHT: Auth form ---------- */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 font-body">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand mark */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[#F2A93B]">
              <Sun className="w-4.5 h-4.5 text-[#14213D]" strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg text-[#14213D] tracking-tight">
              Dayflow <span className="font-normal opacity-60">HRMS</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-[1.9rem] text-[#14213D] font-medium mb-1.5">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-[#6B7280] text-[14px]">
              {isLogin
                ? "Sign in with your work credentials to continue."
                : "Set up access using your employee details."}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="relative grid grid-cols-2 bg-[#F1EEE6] rounded-xl p-1 mb-8">
            <span
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm border border-[#E5E1D8] transition-transform duration-300 ease-out ${
                isLogin ? "translate-x-0" : "translate-x-[calc(100%+8px)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                isLogin ? "text-[#14213D]" : "text-[#9A9488]"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                !isLogin ? "text-[#14213D]" : "text-[#9A9488]"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.75 text-sm rounded-lg border border-[#E5E1D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/40 focus:border-[#F2A93B] placeholder:text-[#B5B0A4] py-2.5"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  required
                  value={form.employeeId}
                  onChange={handleChange("employeeId")}
                  placeholder="EMP-00231"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E5E1D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/40 focus:border-[#F2A93B] placeholder:text-[#B5B0A4]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-[#E5E1D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/40 focus:border-[#F2A93B] placeholder:text-[#B5B0A4]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role select */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleOpen((o) => !o)}
                  className="w-full flex items-center justify-between pl-3.5 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E5E1D8] bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A93B]/40 focus:border-[#F2A93B] text-left"
                >
                  <span className="text-[#111827]">{role}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#9CA3AF] transition-transform ${
                      roleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {roleOpen && (
                  <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-[#E5E1D8] bg-white shadow-lg overflow-hidden">
                    {["Employee", "HR Admin"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setRoleOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-[#F7F5EF] ${
                          role === r
                            ? "text-[#14213D] font-medium bg-[#FBF7EE]"
                            : "text-[#4B5563]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-[13px] pt-1">
                <label className="flex items-center gap-2 text-[#6B7280]">
                  <input
                    type="checkbox"
                    className="rounded border-[#D1CCC0] text-[#F2A93B] focus:ring-[#F2A93B]/40"
                  />
                  Keep me signed in
                </label>
                <a href="#" className="text-[#14213D] font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-2 py-2.75 rounded-lg bg-[#14213D] text-white text-sm font-semibold hover:bg-[#1C2C50] transition-colors py-3"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[13px] text-[#6B7280] mt-7">
            {isLogin ? "New to Dayflow? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "register" : "login")}
              className="text-[#14213D] font-semibold hover:underline"
            >
              {isLogin ? "Register your account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

