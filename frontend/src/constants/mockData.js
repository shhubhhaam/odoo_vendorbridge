const VENDORS = [
  { id: 1, name: "Tata Consultancy Services", category: "IT Services", gst: "27AAACT2727Q1ZW", contact: "Ramesh Kumar", email: "ramesh@tcs.com", phone: "+91-9876543210", status: "Active", rating: 4.8, city: "Mumbai" },
  { id: 2, name: "Infosys Limited", category: "Software", gst: "29AABCI1681G1ZX", contact: "Priya Sharma", email: "priya@infosys.com", phone: "+91-9876543211", status: "Active", rating: 4.5, city: "Bengaluru" },
  { id: 3, name: "Wipro Technologies", category: "IT Services", gst: "29AAACW0X02B1ZJ", contact: "Anil Mehta", email: "anil@wipro.com", phone: "+91-9876543212", status: "Pending", rating: 4.2, city: "Hyderabad" },
  { id: 4, name: "HCL Technologies", category: "Hardware", gst: "09AABCH4605R1ZX", contact: "Sunita Patel", email: "sunita@hcl.com", phone: "+91-9876543213", status: "Active", rating: 4.6, city: "Noida" },
  { id: 5, name: "Tech Mahindra", category: "Telecom", gst: "27AABCT3084M1ZS", contact: "Vikram Singh", email: "vikram@techmahindra.com", phone: "+91-9876543214", status: "Inactive", rating: 3.9, city: "Pune" },
  { id: 6, name: "L&T Infotech", category: "Engineering", gst: "27AABCL1234P1ZA", contact: "Deepa Nair", email: "deepa@lnt.com", phone: "+91-9876543215", status: "Active", rating: 4.3, city: "Mumbai" },
];
 
const RFQS = [
  { id: "RFQ-2024-001", title: "Office Furniture Procurement", category: "Furniture", deadline: "2024-02-28", status: "Published", vendors: 4, responses: 2 },
  { id: "RFQ-2024-002", title: "IT Infrastructure Upgrade", category: "IT Services", deadline: "2024-03-15", status: "Draft", vendors: 3, responses: 0 },
  { id: "RFQ-2024-003", title: "Annual Stationery Supply", category: "Office Supplies", deadline: "2024-02-20", status: "Closed", vendors: 6, responses: 5 },
  { id: "RFQ-2024-004", title: "Software Licenses Q1", category: "Software", deadline: "2024-03-01", status: "Published", vendors: 2, responses: 1 },
  { id: "RFQ-2024-005", title: "Canteen Services Renewal", category: "Services", deadline: "2024-03-30", status: "Published", vendors: 5, responses: 3 },
];
 
const QUOTATIONS = [
  { id: "QT-001", rfq: "RFQ-2024-001", vendor: "Tata Consultancy Services", subtotal: 245000, gst: 44100, total: 289100, delivery: 14, status: "Submitted", rating: 4.8 },
  { id: "QT-002", rfq: "RFQ-2024-001", vendor: "Infosys Limited", subtotal: 198000, gst: 35640, total: 233640, delivery: 21, status: "Submitted", rating: 4.5 },
  { id: "QT-003", rfq: "RFQ-2024-001", vendor: "Wipro Technologies", subtotal: 215000, gst: 38700, total: 253700, delivery: 10, status: "Submitted", rating: 4.2 },
  { id: "QT-004", rfq: "RFQ-2024-003", vendor: "HCL Technologies", subtotal: 85000, gst: 15300, total: 100300, delivery: 7, status: "Approved", rating: 4.6 },
];
 
const PURCHASE_ORDERS = [
  { id: "PO-2024-0021", vendor: "Tata Consultancy Services", amount: 289100, status: "Approved", date: "2024-01-15", items: 5 },
  { id: "PO-2024-0022", vendor: "HCL Technologies", amount: 100300, status: "Pending", date: "2024-01-18", items: 3 },
  { id: "PO-2024-0023", vendor: "Infosys Limited", amount: 455000, status: "Approved", date: "2024-01-20", items: 8 },
  { id: "PO-2024-0024", vendor: "Wipro Technologies", amount: 78500, status: "Rejected", date: "2024-01-22", items: 2 },
  { id: "PO-2024-0025", vendor: "Tech Mahindra", amount: 125000, status: "Pending", date: "2024-01-25", items: 4 },
  { id: "PO-2024-0026", vendor: "L&T Infotech", amount: 340000, status: "Approved", date: "2024-01-28", items: 6 },
];
 
const INVOICES = [
  { id: "INV-2024-0051", po: "PO-2024-0021", vendor: "Tata Consultancy Services", amount: 289100, due: "2024-02-15", status: "Paid" },
  { id: "INV-2024-0052", po: "PO-2024-0022", vendor: "HCL Technologies", amount: 100300, due: "2024-02-18", status: "Pending" },
  { id: "INV-2024-0053", po: "PO-2024-0023", vendor: "Infosys Limited", amount: 455000, due: "2024-01-20", status: "Overdue" },
  { id: "INV-2024-0054", po: "PO-2024-0026", vendor: "L&T Infotech", amount: 340000, due: "2024-02-28", status: "Pending" },
];
 
const ACTIVITY_LOGS = [
  { id: 1, user: "Rajesh Gupta", action: "Created RFQ RFQ-2024-005 for Canteen Services", type: "RFQ", time: "2 minutes ago", avatar: "RG" },
  { id: 2, user: "Meena Iyer", action: "Approved PO-2024-0021 worth ₹2,89,100", type: "Approvals", time: "1 hour ago", avatar: "MI" },
  { id: 3, user: "Suresh Nair", action: "Added new vendor Wipro Technologies", type: "Vendors", time: "3 hours ago", avatar: "SN" },
  { id: 4, user: "Anita Desai", action: "Invoice INV-2024-0053 marked as Overdue", type: "Invoices", time: "5 hours ago", avatar: "AD" },
  { id: 5, user: "Rajesh Gupta", action: "Published RFQ RFQ-2024-004 for Software Licenses", type: "RFQ", time: "1 day ago", avatar: "RG" },
  { id: 6, user: "Karan Malhotra", action: "Submitted quotation QT-003 for RFQ-2024-001", type: "RFQ", time: "1 day ago", avatar: "KM" },
  { id: 7, user: "Meena Iyer", action: "Rejected PO-2024-0024 with remarks", type: "Approvals", time: "2 days ago", avatar: "MI" },
  { id: 8, user: "Suresh Nair", action: "Updated vendor contact for HCL Technologies", type: "Vendors", time: "2 days ago", avatar: "SN" },
];
 
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