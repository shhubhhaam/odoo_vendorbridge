/**
 * FIXED Sidebar NAV_ITEMS — drop-in replacement for the NAV_ITEMS array in App.jsx
 *
 * CHANGES:
 *
 * FIX 29: "Invoices" nav item was MISSING from the sidebar entirely.
 *          Procurement Officers and Vendors had no navigation path to invoices
 *          even though the page and API existed. Added with correct role list.
 *
 * FIX 30: "Quotations" was missing "Manager / Approver" — Approvers need to
 *          review quotations as part of the approval workflow.
 *
 * FIX 31: "Vendors" was Admin-only in nav but Procurement Officers and Managers
 *          need to view vendors (to assign them to RFQs / validate approvals).
 *          Read-only vendor view is now accessible to Officers and Managers.
 *          The Add/Delete buttons inside VendorManagement remain Admin-gated.
 *
 * Sidebar component already filters by role:
 *   const filteredNavItems = NAV_ITEMS.filter(item =>
 *     !item.roles || (user && item.roles.includes(user.role))
 *   );
 *
 * This list is the source of truth — PAGE_ROLES in AppRoutes.jsx must match.
 */

export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "⊞",
    roles: ["Admin", "Procurement Officer", "Manager / Approver"],
  },
  {
    id: "vendors",
    label: "Vendors",
    icon: "🏢",
    // FIX 31: Added Procurement Officer + Manager (read-only; write restricted in component)
    roles: ["Admin", "Procurement Officer", "Manager / Approver"],
  },
  {
    id: "rfqs",
    label: "RFQs",
    icon: "📋",
    roles: ["Admin", "Procurement Officer", "Manager / Approver", "Vendor"],
  },
  {
    id: "quotations",
    label: "Quotations",
    icon: "💬",
    // FIX 30: Manager / Approver must see quotations to approve POs
    roles: ["Admin", "Procurement Officer", "Manager / Approver"],
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: "✓",
    roles: ["Admin", "Manager / Approver"],
  },
  {
    id: "purchase-orders",
    label: "Purchase Orders",
    icon: "📦",
    roles: ["Admin", "Procurement Officer", "Manager / Approver", "Vendor"],
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: "🧾",
    // FIX 29: This nav item was MISSING — Invoices page existed but was unreachable
    roles: ["Admin", "Procurement Officer", "Vendor"],
  },
  {
    id: "activity-logs",
    label: "Activity Logs",
    icon: "🕐",
    roles: ["Admin", "Manager / Approver"],
  },
  {
    id: "users",
    label: "Users",
    icon: "👥",
    roles: ["Admin"],
  },
];
