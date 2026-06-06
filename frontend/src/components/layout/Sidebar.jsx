import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Receipt,
  BarChart3,
  Activity
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Vendors",
    icon: Users
  },
  {
    title: "RFQs",
    icon: FileText
  },
  {
    title: "Quotations",
    icon: ClipboardList
  },
  {
    title: "Invoices",
    icon: Receipt
  },
  {
    title: "Reports",
    icon: BarChart3
  },
  {
    title: "Activity",
    icon: Activity
  }
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">

      <div className="p-5 font-bold text-xl">
        VendorBridge
      </div>

      <nav>
        {menu.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 p-4 hover:bg-gray-100 cursor-pointer"
          >
            <item.icon size={18} />
            {item.title}
          </div>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;