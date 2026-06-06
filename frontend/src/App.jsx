import { useState, useRef, useContext, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { vendorAPI, rfqAPI, poAPI, invoiceAPI, activityAPI, userAPI } from "./services/api";

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Approved: "bg-blue-50 text-blue-700 border border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Published: "bg-blue-50 text-blue-700 border border-blue-200",
  Draft: "bg-gray-100 text-gray-600 border border-gray-200",
  Closed: "bg-gray-100 text-gray-500 border border-gray-200",
  Submitted: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
  Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Overdue: "bg-red-50 text-red-700 border border-red-200",
  Inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, sub, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${colors[color]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── SIMPLE BAR CHART ────────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = "#3b82f6" }) {
  if (!data || data.length === 0) return <div className="text-center py-8 text-gray-400">No data available</div>;
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="flex items-end gap-2 h-32 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(d[valueKey] / max) * 100}%`, backgroundColor: color, opacity: 0.85 }} />
          <span className="text-[10px] text-gray-400">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const colors = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#9ca3af"];
  const total = data.reduce((a, b) => a + b.value, 0);
  let cum = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
        {data.map((d, i) => {
          const pct = d.value / total;
          const start = cum;
          cum += pct;
          const sa = (start - 0.25) * 2 * Math.PI;
          const ea = (cum - 0.25) * 2 * Math.PI;
          const x1 = 50 + 38 * Math.cos(sa), y1 = 50 + 38 * Math.sin(sa);
          const x2 = 50 + 38 * Math.cos(ea), y2 = 50 + 38 * Math.sin(ea);
          const lg = pct > 0.5 ? 1 : 0;
          return <path key={i} d={`M50,50 L${x1},${y1} A38,38,0,${lg},1,${x2},${y2} Z`} fill={colors[i]} />;
        })}
        <circle cx="50" cy="50" r="24" fill="white" />
      </svg>
      <div className="space-y-1.5 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
            <span className="text-xs text-gray-600 flex-1">{d.name}</span>
            <span className="text-xs font-semibold text-gray-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = "max-w-xl" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 text-lg">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400" />
    </div>
  );
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-600">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return <input {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400" />;
}

function Select({ children, ...props }) {
  return <select {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800">{children}</select>;
}

function Textarea({ ...props }) {
  return <textarea {...props} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 resize-none" />;
}

// ─── TABLE ────────────────────────────────────────────────────────────────────
function Table({ cols, rows, actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {cols.map(c => <th key={c.key} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{c.label}</th>)}
            {actions && <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {cols.map(c => (
                <td key={c.key} className="py-3 px-4 text-gray-700 whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && <td className="py-3 px-4 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No records found</div>}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", roles: ["Admin", "Procurement Officer", "Manager / Approver"] },
  { id: "vendors", label: "Vendors", icon: "🏢", roles: ["Admin"] },
  { id: "rfqs", label: "RFQs", icon: "📋", roles: ["Admin", "Procurement Officer", "Vendor"] },
  { id: "quotations", label: "Quotations", icon: "💬", roles: ["Admin", "Procurement Officer"] },
  { id: "approvals", label: "Approvals", icon: "✓", roles: ["Admin", "Manager / Approver"] },
  { id: "purchase-orders", label: "Purchase Orders", icon: "📦", roles: ["Admin", "Procurement Officer", "Vendor"] },
  { id: "activity-logs", label: "Activity Logs", icon: "🕐", roles: ["Admin", "Manager / Approver"] },
  { id: "users", label: "Users", icon: "👥", roles: ["Admin"] },
];

function Sidebar({ active, onNav }) {
  const { user, logout } = useContext(AuthContext);
  
  const filteredNavItems = NAV_ITEMS.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-gray-900 flex flex-col z-30">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">VB</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">VendorBridge</p>
            <p className="text-gray-500 text-[10px]">Procurement ERP</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {filteredNavItems.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${active === item.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <span className="text-base">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.firstName?.[0]}</div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ title }) {
  const { user } = useContext(AuthContext);
  return (
    <header className="fixed left-56 right-0 top-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400">Procurement & Vendor Management</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{user?.firstName?.[0]}</div>
          <div className="text-xs">
            <p className="font-medium text-gray-800">{user?.firstName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── PAGE WRAPPER ─────────────────────────────────────────────────────────────
function PageWrapper({ children }) {
  return <div className="ml-56 mt-14 min-h-[calc(100vh-56px)] bg-gray-50 p-6">{children}</div>;
}

function PageHeader({ title, sub, actions }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>{children}</div>;
}

// ─── BTN ──────────────────────────────────────────────────────────────────────
function Btn({ children, variant = "primary", size = "sm", onClick, className = "", disabled }) {
  const v = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-600",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border border-transparent",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600",
  };
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors ${v[variant]} ${s[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onRegister }) {
  const [email, setEmail] = useState("admin@vendorbridge.com");
  const [pass, setPass] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await login(email, pass);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{ width: 80 + i * 80, height: 80 + i * 80, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏗️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Streamline Your Procurement</h2>
          <p className="text-blue-200 text-base max-w-xs mx-auto leading-relaxed">End-to-end vendor management, RFQs, approvals and purchase orders — all in one platform.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">VB</div>
            <div>
              <p className="font-bold text-gray-900">VendorBridge</p>
              <p className="text-xs text-gray-400">Enterprise Procurement ERP</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-7">Sign in to your account to continue</p>
          <div className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
            <Field label="Email Address" required>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Btn size="lg" onClick={handleLogin} disabled={loading} className="w-full justify-center">{loading ? "Signing in..." : "Sign In to VendorBridge"}</Btn>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <button onClick={onRegister} className="text-blue-600 font-medium hover:underline">Create Account</button></p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRATION SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function RegisterPage({ onBack }) {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "Procurement Officer", country: "India" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      await register(formData.firstName, formData.lastName, formData.email, formData.password, formData.phone, formData.role, formData.country);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-900 px-8 py-5 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">VB</div>
          <p className="text-white font-semibold">VendorBridge — Create Account</p>
        </div>
        <div className="p-8">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg mb-4">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required><Input placeholder="Rajesh" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></Field>
            <Field label="Last Name" required><Input placeholder="Gupta" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></Field>
            <Field label="Email Address" required><Input type="email" placeholder="rajesh@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></Field>
            <Field label="Password" required>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Field label="Phone Number"><Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></Field>
            <Field label="Role" required>
              <Select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option>Procurement Officer</option>
                <option>Vendor</option>
                <option>Manager / Approver</option>
                <option>Admin</option>
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="Country" required>
                <Select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Singapore</option>
                </Select>
              </Field>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Btn size="md" onClick={onBack} variant="secondary">← Back to Login</Btn>
            <Btn size="md" onClick={handleRegister} disabled={loading} className="flex-1 justify-center">{loading ? "Creating..." : "Create Account"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ onNav }) {
  const [stats, setStats] = useState({ rfqs: 0, approvals: 0, spend: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rfqs, pos, invoices] = await Promise.all([
        rfqAPI.getAll().catch(() => ({ data: { rfqs: [] } })),
        poAPI.getAll().catch(() => ({ data: { pos: [] } })),
        invoiceAPI.getAll().catch(() => ({ data: { invoices: [] } }))
      ]);

      const totalSpend = pos.data.pos?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const overdueInvoices = invoices.data.invoices?.filter(i => i.status === "Overdue") || [];
      const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

      setStats({
        rfqs: rfqs.data.rfqs?.length || 0,
        approvals: pos.data.pos?.filter(p => p.status === "Pending").length || 0,
        spend: totalSpend,
        overdue: overdueAmount
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const SPEND_DATA = [
    { month: "Aug", spend: 420000 },
    { month: "Sep", spend: 380000 },
    { month: "Oct", spend: 510000 },
    { month: "Nov", spend: 460000 },
    { month: "Dec", spend: 390000 },
    { month: "Jan", spend: 540000 },
  ];

  const CATEGORY_DATA = [
    { name: "IT Services", value: 38 },
    { name: "Software", value: 22 },
    { name: "Hardware", value: 18 },
    { name: "Services", value: 12 },
    { name: "Other", value: 10 },
  ];

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" sub="Welcome back. Here's your procurement overview." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Active RFQs" value={stats.rfqs} sub={`${stats.rfqs} ongoing`} icon="📋" color="blue" />
        <KPICard title="Pending Approvals" value={stats.approvals} sub="Requires attention" icon="⏳" color="amber" />
        <KPICard title="Monthly Spend" value={fmt(stats.spend)} sub="Total procurement" icon="💰" color="emerald" />
        <KPICard title="Overdue Invoices" value={fmt(stats.overdue)} sub="Overdue amount" icon="⚠️" color="red" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Card>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Monthly Procurement Spend</h3>
            </div>
            <div className="px-5 py-4">
              <BarChart data={SPEND_DATA} valueKey="spend" labelKey="month" color="#3b82f6" />
            </div>
          </Card>
        </div>
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Spend by Category</h3>
          </div>
          <div className="px-5 py-4">
            <DonutChart data={CATEGORY_DATA} />
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VENDOR MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", category: "", gst: "", email: "", phone: "", contact: "", address: "", city: "", status: "Active" });
  const { user } = useContext(AuthContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await vendorAPI.delete(id);
      fetchVendors();
    } catch (error) {
      alert("Error deleting vendor: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getAll();
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async () => {
    try {
      await vendorAPI.create(formData);
      setAddModal(false);
      setFormData({ name: "", category: "", gst: "", email: "", phone: "", contact: "", address: "", city: "", status: "Active" });
      fetchVendors();
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("Error adding vendor: " + (error.response?.data?.message || error.message));
    }
  };

  const filtered = vendors.filter(v =>
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.contact.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || v.status === statusFilter) &&
    (catFilter === "All" || v.category === catFilter)
  );

  return (
    <PageWrapper>
      <PageHeader title="Vendor Management" sub={`${vendors.length} registered vendors`}
        actions={user?.role === "Admin" ? <Btn onClick={() => setAddModal(true)}>+ Add Vendor</Btn> : null} />
      <Card className="mb-4">
        <div className="p-4 flex flex-wrap gap-3 border-b border-gray-100">
          <div className="flex-1 min-w-48"><SearchBar value={search} onChange={setSearch} placeholder="Search vendors…" /></div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 130 }}>
            <option>All</option><option>Active</option><option>Pending</option><option>Inactive</option>
          </Select>
          <Select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 150 }}>
            <option>All</option><option>IT Services</option><option>Software</option><option>Hardware</option><option>Telecom</option><option>Engineering</option>
          </Select>
        </div>
        <Table
          cols={[
            { key: "name", label: "Vendor Name", render: r => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">{r.name[0]}</div>
                <div>
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.city}</p>
                </div>
              </div>
            )},
            { key: "category", label: "Category", render: r => <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{r.category}</span> },
            { key: "gst", label: "GST Number", render: r => <span className="font-mono text-xs text-gray-600">{r.gst}</span> },
            { key: "contact", label: "Contact", render: r => <div><p className="text-sm">{r.contact}</p><p className="text-[11px] text-gray-400">{r.email}</p></div> },
            { key: "rating", label: "Rating", render: r => <span className="text-sm font-semibold text-amber-600">★ {r.rating || 0}</span> },
            { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
          ]}
          rows={filtered}
          actions={row => (
            <div className="flex gap-1 justify-end">
              <Btn variant="ghost" size="sm" onClick={() => setViewVendor(row)}>View</Btn>
              {user?.role === "Admin" && <Btn variant="danger" size="sm" onClick={() => handleDelete(row._id)}>Del</Btn>}
            </div>
          )}
        />
      </Card>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Vendor">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Company Name" required><Input placeholder="Company Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></Field></div>
          <Field label="GST Number" required><Input placeholder="GST" value={formData.gst} onChange={e => setFormData({ ...formData, gst: e.target.value })} /></Field>
          <Field label="Category" required>
            <Select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              <option>IT Services</option><option>Software</option><option>Hardware</option><option>Engineering</option><option>Telecom</option>
            </Select>
          </Field>
          <Field label="Email" required><Input type="email" placeholder="email@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></Field>
          <Field label="Phone"><Input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></Field>
          <Field label="City"><Input placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Contact Person" required><Input placeholder="Contact Name" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} /></Field></div>
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
          <Btn variant="secondary" onClick={() => setAddModal(false)}>Cancel</Btn>
          <Btn onClick={handleAddVendor}>Save Vendor</Btn>
        </div>
      </Modal>



      <Modal open={!!viewVendor} onClose={() => setViewVendor(null)} title="Vendor Details">
        {viewVendor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">{viewVendor.name[0]}</div>
              <div>
                <h3 className="font-bold text-gray-900">{viewVendor.name}</h3>
                <p className="text-sm text-gray-500">{viewVendor.category} · {viewVendor.city}</p>
                <StatusBadge status={viewVendor.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["GST", viewVendor.gst], ["Contact", viewVendor.contact], ["Email", viewVendor.email], ["Phone", viewVendor.phone], ["Rating", `★ ${viewVendor.rating || 0}`]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-medium text-gray-800">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAll();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userAPI.delete(id);
      fetchUsers();
      alert("User deleted");
    } catch (error) {
      alert("Error deleting user: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <PageWrapper>
      <PageHeader title="User Management" sub={`${users.length} registered users`} />
      <Card>
        <Table
          cols={[
            { key: "name", label: "Name", render: u => `${u.firstName} ${u.lastName}` },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "isActive", label: "Active", render: u => u.isActive ? "Yes" : "No" },
            { key: "createdAt", label: "Created", render: u => new Date(u.createdAt).toLocaleDateString() },
          ]}
          rows={users}
          actions={row => (
            <div className="flex gap-1 justify-end">
              {user?.role === "Admin" && <Btn variant="danger" size="sm" onClick={() => handleDelete(row._id)}>Delete</Btn>}
            </div>
          )}
        />
      </Card>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RFQ PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function RFQPage() {
  const [rfqs, setRfqs] = useState([]);
  const { user } = useContext(AuthContext);
  const canManageRFQ = user && ["Procurement Officer", "Admin", "Manager / Approver"].includes(user.role);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [quoteModal, setQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ subtotal: "", gst: 18, delivery: 7, paymentTerms: "", notes: "" });
  const [activeRfqForQuote, setActiveRfqForQuote] = useState(null);
  const [formData, setFormData] = useState({ title: "", category: "", description: "", deadline: "", vendors: [] });

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      const response = await rfqAPI.getAll();
      setRfqs(response.data.rfqs || []);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRFQ = async () => {
    try {
      await rfqAPI.create(formData);
      setCreateModal(false);
      setFormData({ title: "", category: "", description: "", deadline: "", vendors: [] });
      fetchRFQs();
      alert("RFQ created successfully!");
    } catch (error) {
      alert("Error creating RFQ: " + (error.response?.data?.message || error.message));
    }
  };

  const openQuoteModal = (rfq) => {
    setActiveRfqForQuote(rfq);
    setQuoteForm({ subtotal: "", gst: 18, delivery: 7, paymentTerms: "", notes: "" });
    setQuoteModal(true);
  };

  const handleSubmitQuote = async () => {
    if (!activeRfqForQuote) return;
    try {
      const payload = {
        subtotal: Number(quoteForm.subtotal),
        gst: Number(quoteForm.gst),
        delivery: Number(quoteForm.delivery),
        paymentTerms: quoteForm.paymentTerms,
        notes: quoteForm.notes,
      };
      await rfqAPI.submitQuotation(activeRfqForQuote._id, payload);
      setQuoteModal(false);
      setActiveRfqForQuote(null);
      fetchRFQs();
      alert("Quotation submitted successfully");
    } catch (error) {
      alert("Error submitting quotation: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePublish = async (rfqId) => {
    try {
      await rfqAPI.publish(rfqId);
      fetchRFQs();
      alert("RFQ published successfully!");
    } catch (error) {
      alert("Error publishing RFQ: " + (error.response?.data?.message || error.message));
    }
  };

  const filtered = rfqs.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All Status" || r.status === statusFilter)
  );

  return (
    <PageWrapper>
      <PageHeader title="Request for Quotations" sub={`${rfqs.length} total RFQs`}
        actions={canManageRFQ ? <Btn onClick={() => setCreateModal(true)}>+ Create RFQ</Btn> : null} />
      <Card className="mb-4">
        <div className="p-4 flex gap-3 border-b border-gray-100">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search RFQs…" /></div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 130 }}>
            <option>All Status</option><option>Published</option><option>Draft</option><option>Closed</option>
          </Select>
        </div>
        <Table
          cols={[
            { key: "rfqId", label: "RFQ ID", render: r => <span className="font-mono text-xs font-semibold text-blue-600">{r.rfqId || r._id}</span> },
            { key: "title", label: "Title" },
            { key: "category", label: "Category", render: r => <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{r.category}</span> },
            { key: "deadline", label: "Deadline", render: r => new Date(r.deadline).toLocaleDateString() },
            { key: "responses", label: "Responses", render: r => <span className="text-sm font-semibold">{r.responses} responses</span> },
            { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
          ]}
          rows={filtered}
          actions={row => {
            if (row.status === "Draft") return canManageRFQ ? <Btn variant="primary" size="sm" onClick={() => handlePublish(row._id)}>Publish</Btn> : null;
            if (user?.role === "Vendor") return <Btn variant="primary" size="sm" onClick={() => openQuoteModal(row)}>Submit Quote</Btn>;
            return <Btn variant="ghost" size="sm">View Quotes</Btn>;
          }}
        />
      </Card>

      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create New RFQ">
        <div className="space-y-4">
          <Field label="RFQ Title" required>
            <Input placeholder="e.g., Office Supplies Request" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </Field>
          <Field label="Category" required>
            <Select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              <option>IT Services</option><option>Software</option><option>Hardware</option><option>Engineering</option><option>Telecom</option>
            </Select>
          </Field>
          <Field label="Description" required>
            <Textarea placeholder="Describe your requirements…" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </Field>
          <Field label="Deadline" required>
            <Input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Btn>
            <Btn onClick={handleCreateRFQ}>Create RFQ</Btn>
          </div>
        </div>
      </Modal>
      <Modal open={quoteModal} onClose={() => setQuoteModal(false)} title={activeRfqForQuote ? `Submit Quote - ${activeRfqForQuote.title}` : "Submit Quote"}>
        <div className="space-y-4">
          <Field label="Subtotal (₹)" required>
            <Input type="number" value={quoteForm.subtotal} onChange={e => setQuoteForm({ ...quoteForm, subtotal: e.target.value })} />
          </Field>
          <Field label="GST (%)" required>
            <Input type="number" value={quoteForm.gst} onChange={e => setQuoteForm({ ...quoteForm, gst: e.target.value })} />
          </Field>
          <Field label="Delivery (days)" required>
            <Input type="number" value={quoteForm.delivery} onChange={e => setQuoteForm({ ...quoteForm, delivery: e.target.value })} />
          </Field>
          <Field label="Payment Terms"><Input value={quoteForm.paymentTerms} onChange={e => setQuoteForm({ ...quoteForm, paymentTerms: e.target.value })} /></Field>
          <Field label="Notes"><Textarea value={quoteForm.notes} onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })} rows={3} /></Field>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setQuoteModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmitQuote}>Submit Quote</Btn>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PURCHASE ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
function PurchaseOrders() {
  const [pos, setPos] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("po");
  const [loading, setLoading] = useState(true);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ to: "", subject: "", message: "" });
  const [remarksModal, setRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [remarksAction, setRemarksAction] = useState(null);
  const [activePo, setActivePo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posData, invoiceData] = await Promise.all([
        poAPI.getAll().catch(() => ({ data: { pos: [] } })),
        invoiceAPI.getAll().catch(() => ({ data: { invoices: [] } }))
      ]);
      setPos(posData.data.pos || []);
      setInvoices(invoiceData.data.invoices || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = (invoice) => {
    setPrintInvoice(invoice);
  };

  const handleEmailInvoice = (invoice) => {
    setEmailData({ to: invoice.vendor?.email || "", subject: `Invoice ${invoice.invoiceId}`, message: `Please find the invoice attached.` });
    setEmailModal(true);
  };

  const canApprove = user && ["Manager / Approver", "Admin"].includes(user.role);

  const openRemarksModal = (po, action) => {
    setActivePo(po);
    setRemarksAction(action);
    setRemarks("");
    setRemarksModal(true);
  };

  const handleSubmitRemarks = async () => {
    if (!activePo || !remarksAction) return;
    try {
      if (remarksAction === "approve") await poAPI.approve(activePo._id, remarks);
      else await poAPI.reject(activePo._id, remarks);
      setRemarksModal(false);
      setActivePo(null);
      fetchData();
      alert(`PO ${remarksAction}d successfully`);
    } catch (error) {
      alert((error.response?.data?.message) || error.message);
    }
  };

  const handleCreateInvoice = async (po) => {
    try {
      const invoiceData = {
        po: po._id,
        vendor: po.vendor._id,
        amount: po.amount,
        due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      await invoiceAPI.create(invoiceData);
      fetchData();
      alert(`Invoice generated for PO ${po.poId}`);
    } catch (error) {
      alert((error.response?.data?.message) || error.message);
    }
  };

  const handleSendEmail = () => {
    alert(`Email would be sent to ${emailData.to} with subject: ${emailData.subject}`);
    setEmailModal(false);
  };

  return (
    <PageWrapper>
      <PageHeader title="Purchase Orders & Invoices" />
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
        {[["po", "Purchase Orders"], ["inv", "Invoices"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${tab === k ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{l}</button>
        ))}
      </div>
      {tab === "po" ? (
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">All Purchase Orders</h3>
          </div>
          <div className="p-4 flex gap-4">
            <div className="px-4 py-2 bg-white rounded shadow-sm">
              <div className="text-xs text-gray-500">Total POs</div>
              <div className="text-lg font-bold">{pos.length}</div>
            </div>
            <div className="px-4 py-2 bg-white rounded shadow-sm">
              <div className="text-xs text-gray-500">Pending</div>
              <div className="text-lg font-bold">{pos.filter(p=>p.status==="Pending").length}</div>
            </div>
            <div className="px-4 py-2 bg-white rounded shadow-sm">
              <div className="text-xs text-gray-500">Approved</div>
              <div className="text-lg font-bold">{pos.filter(p=>p.status==="Approved").length}</div>
            </div>
            <div className="px-4 py-2 bg-white rounded shadow-sm">
              <div className="text-xs text-gray-500">Rejected</div>
              <div className="text-lg font-bold">{pos.filter(p=>p.status==="Rejected").length}</div>
            </div>
          </div>

          <Table
            cols={[
              { key: "poId", label: "PO Number", render: r => <span className="font-mono text-xs font-semibold text-blue-600">{r.poId || r._id}</span> },
              { key: "vendor", label: "Vendor", render: r => r.vendor?.name || "N/A" },
              { key: "amount", label: "Amount", render: r => fmt(r.amount) },
              { key: "items", label: "Items" },
              { key: "createdAt", label: "Date", render: r => new Date(r.createdAt || Date.now()).toLocaleDateString() },
              { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
            ]}
            rows={pos}
            actions={row => (
              <div className="flex gap-1 justify-end">
                {canApprove && row.status === "Pending" && (
                  <>
                    <Btn variant="ghost" size="sm" onClick={() => openRemarksModal(row, "reject")}>Reject</Btn>
                    <Btn variant="primary" size="sm" onClick={() => openRemarksModal(row, "approve")}>Approve</Btn>
                  </>
                )}
                {row.status === "Approved" && (user?.role === "Procurement Officer" || user?.role === "Admin") && (
                  <Btn variant="success" size="sm" onClick={() => handleCreateInvoice(row)}>Gen Invoice</Btn>
                )}
                <Btn variant="ghost" size="sm" onClick={() => handlePrintInvoice(row)}>View</Btn>
              </div>
            )}
          />
        </Card>
      ) : (
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">All Invoices</h3>
          </div>
          <Table
            cols={[
              { key: "invoiceId", label: "Invoice No.", render: r => <span className="font-mono text-xs font-semibold text-blue-600">{r.invoiceId || r._id}</span> },
              { key: "vendor", label: "Vendor", render: r => r.vendor?.name || "N/A" },
              { key: "amount", label: "Amount", render: r => fmt(r.amount) },
              { key: "due", label: "Due Date", render: r => new Date(r.due).toLocaleDateString() },
              { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
            ]}
            rows={invoices}
            actions={row => (
              <div className="flex gap-1 justify-end">
                <Btn variant="ghost" size="sm" onClick={() => handlePrintInvoice(row)}>🖨️ Print</Btn>
                <Btn variant="ghost" size="sm" onClick={() => handleEmailInvoice(row)}>📧 Email</Btn>
              </div>
            )}
          />
        </Card>
      )}

      {/* Print Invoice Modal */}
      {printInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Invoice Preview</h2>
              <button onClick={() => setPrintInvoice(null)} className="text-gray-400 hover:text-gray-700 text-lg">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="bg-white rounded-lg border border-gray-300 p-8">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">INVOICE</p>
                    <p className="text-sm text-gray-600 mt-1">Invoice #{printInvoice.invoiceId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">VB</p>
                    <p className="text-xs text-gray-500">VendorBridge</p>
                  </div>
                </div>

                {/* Bill From/To */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">From</p>
                    <p className="font-semibold text-gray-900">VendorBridge Solutions</p>
                    <p className="text-sm text-gray-600">Bangalore, India</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Bill To</p>
                    <p className="font-semibold text-gray-900">{printInvoice.vendor?.name || "Vendor"}</p>
                    <p className="text-sm text-gray-600">{printInvoice.vendor?.city || "City"}</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Invoice Date</p>
                    <p className="text-sm text-gray-900">{new Date(printInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Due Date</p>
                    <p className="text-sm text-gray-900">{new Date(printInvoice.due).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                    <StatusBadge status={printInvoice.status} />
                  </div>
                </div>

                {/* Amount Table */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">{fmt(printInvoice.amount * 0.85)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18% GST):</span>
                      <span className="font-semibold text-gray-900">{fmt(printInvoice.amount * 0.15)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-600">{fmt(printInvoice.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-gray-200 text-xs text-gray-500">
                  <p>Thank you for your business!</p>
                  <p className="mt-2">For inquiries, contact: support@vendorbridge.com | +91-XXXX-XXXX-XXXX</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <Btn variant="secondary" onClick={() => setPrintInvoice(null)}>Close</Btn>
              <Btn onClick={() => window.print()}>🖨️ Print Invoice</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Email Invoice Modal */}
      <Modal open={emailModal} onClose={() => setEmailModal(false)} title="Email Invoice">
        <div className="space-y-4">
          <Field label="Recipient Email" required>
            <Input type="email" value={emailData.to} onChange={e => setEmailData({ ...emailData, to: e.target.value })} />
          </Field>
          <Field label="Subject" required>
            <Input value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} />
          </Field>
          <Field label="Message">
            <Textarea value={emailData.message} onChange={e => setEmailData({ ...emailData, message: e.target.value })} rows={4} />
          </Field>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setEmailModal(false)}>Cancel</Btn>
            <Btn onClick={handleSendEmail}>📧 Send Email</Btn>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUOTATIONS PAGE - Compare vendor quotations
// ═══════════════════════════════════════════════════════════════════════════════
function QuotationsPage({ onNav }) {
  const [rfqs, setRfqs] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [poForm, setPoForm] = useState({ items: 1, comments: "" });

  useEffect(() => {
    fetchRFQsWithQuotes();
  }, []);

  const fetchRFQsWithQuotes = async () => {
    try {
      setLoading(true);
      const response = await rfqAPI.getAll();
      setRfqs(response.data.rfqs?.filter(r => r.status !== "Draft") || []);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRfq = (rfq) => {
    setSelectedRfq(rfq);
    // In real scenario, fetch quotations for this RFQ from backend
    // For now, showing mock quotations
    setQuotations([
      {
        _id: "q1",
        quotationId: "QUOTE-2024-001",
        vendor: { name: "TechVendor A", city: "Bangalore", rating: 4.5 },
        amount: 95000,
        gst: 18,
        delivery: 15,
        paymentTerms: "30 days",
        status: "Submitted",
        createdAt: new Date()
      },
      {
        _id: "q2",
        quotationId: "QUOTE-2024-002",
        vendor: { name: "TechVendor B", city: "Mumbai", rating: 4.2 },
        amount: 85000,
        gst: 18,
        delivery: 10,
        paymentTerms: "Net 45",
        status: "Submitted",
        createdAt: new Date()
      },
      {
        _id: "q3",
        quotationId: "QUOTE-2024-003",
        vendor: { name: "TechVendor C", city: "Delhi", rating: 3.8 },
        amount: 78000,
        gst: 18,
        delivery: 20,
        paymentTerms: "Advance 50%",
        status: "Submitted",
        createdAt: new Date()
      }
    ]);
  };

  const handleConvertToPO = async () => {
    if (!selectedQuote) return;
    try {
      const poData = {
        vendor: selectedQuote.vendor._id,
        quotation: selectedQuote._id,
        rfq: selectedRfq._id,
        amount: selectedQuote.amount * (1 + selectedQuote.gst / 100),
        items: poForm.items,
        lineItems: [{ description: selectedRfq.title, quantity: poForm.items, unitPrice: selectedQuote.amount / poForm.items }],
        status: "Pending"
      };
      await poAPI.create(poData);
      setSelectModal(false);
      setSelectedRfq(null);
      setQuotations([]);
      alert("PO created successfully!");
    } catch (error) {
      alert("Error creating PO: " + (error.response?.data?.message || error.message));
    }
  };

  if (!selectedRfq) {
    return (
      <PageWrapper>
        <PageHeader title="Quotations" sub="Compare vendor quotations and select the best offer" />
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Published RFQs Awaiting Quote Selection</h3>
          </div>
          <Table
            cols={[
              { key: "rfqId", label: "RFQ ID", render: r => <span className="font-mono text-xs font-semibold text-blue-600">{r.rfqId}</span> },
              { key: "title", label: "Title" },
              { key: "category", label: "Category" },
              { key: "responses", label: "Quotations", render: r => <span className="font-bold text-amber-600">{r.responses} received</span> },
              { key: "deadline", label: "Deadline", render: r => new Date(r.deadline).toLocaleDateString() },
            ]}
            rows={rfqs}
            actions={row => <Btn variant="primary" size="sm" onClick={() => handleSelectRfq(row)}>View Quotes</Btn>}
          />
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title={`Comparing Quotations - ${selectedRfq.rfqId}`} sub={selectedRfq.title}
        actions={<Btn variant="secondary" onClick={() => { setSelectedRfq(null); setQuotations([]); }}>← Back to RFQs</Btn>} />
      <div className="grid grid-cols-1 gap-4">
        {quotations.map(quote => (
          <Card key={quote._id} className={`p-5 cursor-pointer transition-all border-2 ${selectedQuote?._id === quote._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
            onClick={() => setSelectedQuote(selectedQuote?._id === quote._id ? null : quote)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{quote.vendor.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{quote.vendor.name}</h3>
                    <p className="text-xs text-gray-500">{quote.vendor.city} • ★ {quote.vendor.rating}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">Quote Amount</p>
                    <p className="font-bold text-gray-900">{fmt(quote.amount)}</p>
                    <p className="text-xs text-gray-400 mt-1">+ {quote.gst}% GST</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">Total (incl. GST)</p>
                    <p className="font-bold text-gray-900 text-lg">{fmt(quote.amount * (1 + quote.gst / 100))}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">Delivery</p>
                    <p className="font-bold text-gray-900">{quote.delivery} days</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">Payment Terms</p>
                    <p className="font-bold text-gray-900 text-sm">{quote.paymentTerms}</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {selectedQuote?._id === quote._id ? (
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-700 text-xl font-bold">✓</div>
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-gray-200 bg-white" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedQuote && (
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="secondary" onClick={() => setSelectedQuote(null)}>Deselect</Btn>
          {user && ["Procurement Officer", "Admin", "Manager / Approver"].includes(user.role) && (
            <Btn onClick={() => setSelectModal(true)}>Convert to PO →</Btn>
          )}
        </div>
      )}

      <Modal open={selectModal} onClose={() => setSelectModal(false)} title="Convert to Purchase Order">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">Selected Vendor</p>
            <p className="text-sm text-blue-800">{selectedQuote?.vendor.name}</p>
            <p className="text-sm font-bold text-blue-900 mt-1">{fmt(selectedQuote?.amount * (1 + selectedQuote?.gst / 100))}</p>
          </div>
          <Field label="Number of Items" required>
            <Input type="number" min="1" value={poForm.items} onChange={e => setPoForm({ ...poForm, items: parseInt(e.target.value) })} />
          </Field>
          <Field label="Comments">
            <Textarea placeholder="Any special instructions..." value={poForm.comments} onChange={e => setPoForm({ ...poForm, comments: e.target.value })} rows={3} />
          </Field>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total PO Value:</span>
              <span className="text-lg font-bold text-gray-900">{fmt(selectedQuote?.amount * (1 + selectedQuote?.gst / 100))}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setSelectModal(false)}>Cancel</Btn>
            <Btn onClick={handleConvertToPO}>Create PO</Btn>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPROVALS PAGE - Multi-level approval workflow
// ═══════════════════════════════════════════════════════════════════════════════
function ApprovalsPage({ onNav }) {
  const [pos, setPos] = useState([]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvalModal, setApprovalModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchPendingPOs();
  }, []);

  const fetchPendingPOs = async () => {
    try {
      setLoading(true);
      const response = await poAPI.getAll();
      setPos(response.data.pos?.filter(p => p.status === "Pending") || []);
    } catch (error) {
      console.error("Error fetching POs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPo) return;
    try {
      await poAPI.approve(selectedPo._id, remarks);
      setApprovalModal(false);
      setRemarks("");
      setSelectedPo(null);
      fetchPendingPOs();
      alert("PO approved successfully!");
    } catch (error) {
      alert("Error approving PO: " + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async () => {
    if (!selectedPo) return;
    try {
      await poAPI.reject(selectedPo._id, remarks);
      setApprovalModal(false);
      setRemarks("");
      setSelectedPo(null);
      fetchPendingPOs();
      alert("PO rejected successfully!");
    } catch (error) {
      alert("Error rejecting PO: " + (error.response?.data?.message || error.message));
    }
  };

  if (!selectedPo) {
    return (
      <PageWrapper>
        <PageHeader title="Approval Workflow" sub="Review and approve pending purchase orders" />
        {pos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-gray-600 font-semibold">No pending approvals</p>
            <p className="text-sm text-gray-400 mt-1">All purchase orders have been reviewed</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pos.map(po => (
              <Card key={po._id} className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPo(po)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-semibold text-blue-600">{po.poId}</span>
                      <span className="text-sm font-semibold text-gray-900">{po.vendor?.name || "N/A"}</span>
                      <StatusBadge status={po.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{po.lineItems?.length || 0} items • {fmt(po.amount)}</p>
                    <div className="flex gap-2">
                      {po.approvalHistory?.map((h, i) => (
                        <div key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">{h.status}</div>
                      )) || <span className="text-xs text-gray-400">No approvals yet</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Btn variant="primary" size="sm">Review →</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title={`Review - ${selectedPo.poId}`} sub={selectedPo.vendor?.name}
        actions={<Btn variant="secondary" onClick={() => setSelectedPo(null)}>← Back to Queue</Btn>} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1">PO Amount</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(selectedPo.amount)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1">Items</p>
          <p className="text-2xl font-bold text-gray-900">{selectedPo.lineItems?.length || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <StatusBadge status={selectedPo.status} />
        </Card>
      </div>
      <Card className="mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Approval History</h3>
        </div>
        <div className="p-5">
          {selectedPo.approvalHistory && selectedPo.approvalHistory.length > 0 ? (
            <div className="space-y-3">
              {selectedPo.approvalHistory.map((approval, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${approval.status === "Approved" ? "bg-green-500" : approval.status === "Rejected" ? "bg-red-500" : "bg-gray-400"}`}>
                    {approval.status === "Approved" ? "✓" : approval.status === "Rejected" ? "✕" : "○"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Level {i + 1}: {approval.status}</p>
                    <p className="text-xs text-gray-600">By {approval.approvedBy}</p>
                    {approval.remarks && <p className="text-xs text-gray-500 mt-1">{approval.remarks}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(approval.date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No approvals yet - awaiting first level review</p>
          )}
        </div>
      </Card>
      <div className="flex justify-end gap-2">
        <Btn variant="danger" onClick={() => { setSelectedPo(null); setApprovalModal(false); }}>Decline PO</Btn>
        <Btn onClick={() => setApprovalModal(true)}>Approve PO →</Btn>
      </div>

      <Modal open={approvalModal} onClose={() => setApprovalModal(false)} title="Approve Purchase Order">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900">Approving PO: {selectedPo?.poId}</p>
            <p className="text-sm text-green-800 mt-1">{fmt(selectedPo?.amount)} • {selectedPo?.vendor?.name}</p>
          </div>
          <Field label="Approval Remarks">
            <Textarea placeholder="Add your comments for approval..." value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
          </Field>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Btn variant="secondary" onClick={() => setApprovalModal(false)}>Cancel</Btn>
            <Btn variant="success" onClick={handleApprove}>Approve</Btn>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY LOGS
// ═══════════════════════════════════════════════════════════════════════════════
function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = filter === "All" ? await activityAPI.getAll().catch(() => ({ data: { activities: [] } })) : await activityAPI.getByType(filter).catch(() => ({ data: { activities: [] } }));
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All", "RFQ", "Approvals", "Invoice", "Vendors"];
  const typeColors = { RFQ: "bg-blue-50 text-blue-600", Approvals: "bg-amber-50 text-amber-600", Invoice: "bg-red-50 text-red-600", Vendors: "bg-emerald-50 text-emerald-600" };

  return (
    <PageWrapper>
      <PageHeader title="Activity Logs" sub="Complete audit trail of all procurement activities" />
      <div className="flex gap-2 mb-5">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"}`}>
            {f}
          </button>
        ))}
      </div>
      <Card className="p-5">
        <div className="relative pl-6 space-y-0">
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-100" />
          {activities.length > 0 ? (
            activities.map((log, i) => (
              <div key={log._id} className="relative flex gap-4 pb-5">
                <div className="absolute -left-6 w-3 h-3 rounded-full bg-blue-500 border-2 border-white mt-1.5 flex-shrink-0" />
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-700">{log.user?.firstName?.[0]}</div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{log.user?.firstName} {log.user?.lastName}</span>
                      <span className="text-gray-500 text-sm"> · {log.action}</span>
                    </div>
                    <span className={`flex-shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${typeColors[log.type] || "bg-gray-100 text-gray-500"}`}>{log.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">🕐 {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">No activities yet</div>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
const PAGE_TITLES = {
  dashboard: "Dashboard",
  vendors: "Vendor Management",
  rfqs: "Request for Quotations",
  quotations: "Compare Quotations",
  approvals: "Approval Workflow",
  "purchase-orders": "Purchase Orders & Invoices",
  "activity-logs": "Activity Logs",
  "users": "User Management",
};

function AppContent() {
  const [page, setPage] = useState("dashboard");
  const [screen, setScreen] = useState("login");
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (screen === "login") return <LoginPage onRegister={() => setScreen("register")} />;
    if (screen === "register") return <RegisterPage onBack={() => setScreen("login")} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard onNav={setPage} />;
      case "vendors": return <VendorManagement />;
      case "rfqs": return <RFQPage />;
      case "quotations": return <QuotationsPage onNav={setPage} />;
      case "approvals": return <ApprovalsPage onNav={setPage} />;
      case "purchase-orders": return <PurchaseOrders />;
      case "activity-logs": return <ActivityLogs />;
      case "users": return <UsersManagement />;
      default: return <Dashboard onNav={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar active={page} onNav={setPage} />
      <TopNav title={PAGE_TITLES[page] || "VendorBridge"} />
      {renderPage()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
