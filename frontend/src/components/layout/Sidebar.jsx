const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "vendors", label: "Vendors", icon: "🏢" },
  { id: "rfqs", label: "RFQs", icon: "📋" },
  { id: "quotations", label: "Quotations", icon: "💬" },
  { id: "approvals", label: "Approvals", icon: "✅" },
  { id: "purchase-orders", label: "Purchase Orders", icon: "📦" },
  { id: "invoices", label: "Invoices", icon: "🧾" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "activity-logs", label: "Activity Logs", icon: "🕐" },
];
 
function Sidebar({ active, onNav }) {
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
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${active === item.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <span className="text-base">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">RG</div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Rajesh Gupta</p>
            <p className="text-gray-500 text-[10px] truncate">Procurement Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;