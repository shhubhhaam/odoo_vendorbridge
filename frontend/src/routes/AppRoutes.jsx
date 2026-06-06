/**
 * FRONTEND ROLE GATE — replaces the unguarded renderPage() switch in App.jsx
 *
 * The original AppContent switch rendered ANY page for ANY authenticated user
 * simply by setting the `page` state. A Vendor could navigate to "users" or
 * "approvals" by manipulating state (or the Sidebar nav) and the component
 * would render with full API access.
 *
 * This module exports a `renderPage()` function and a PAGE_ROLES map that
 * enforces role restrictions on the client side.
 *
 * IMPORTANT: Client-side guards are UX convenience only — the real enforcement
 * is always the backend middleware. Both layers must be correct.
 *
 * Usage in AppContent:
 *   import { renderPage } from './routes/AppRoutes';
 *   ...
 *   {renderPage(page, user, setPage)}
 */

// Canonical page → allowed roles map (mirrors backend route permissions)
export const PAGE_ROLES = {
  dashboard: ["Admin", "Procurement Officer", "Manager / Approver"],
  vendors: ["Admin", "Procurement Officer", "Manager / Approver"],
  rfqs: ["Admin", "Procurement Officer", "Manager / Approver", "Vendor"],
  quotations: ["Admin", "Procurement Officer", "Manager / Approver"],
  approvals: ["Admin", "Manager / Approver"],
  "purchase-orders": ["Admin", "Procurement Officer", "Manager / Approver", "Vendor"],
  invoices: ["Admin", "Procurement Officer", "Vendor"],
  "activity-logs": ["Admin", "Manager / Approver"],
  users: ["Admin"],
};

/**
 * canAccess — returns true if the user's role is allowed on the given page.
 * Called both by the Sidebar (to hide links) and by renderPage (to block render).
 */
export function canAccess(pageId, userRole) {
  const allowed = PAGE_ROLES[pageId];
  if (!allowed) return false;
  return allowed.includes(userRole);
}

/**
 * AccessDenied — shown when a user somehow navigates to a forbidden page
 * (e.g. by direct state manipulation in dev tools).
 */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
      <span className="text-5xl">🚫</span>
      <p className="text-lg font-semibold text-gray-600">Access Denied</p>
      <p className="text-sm">You don't have permission to view this page.</p>
    </div>
  );
}

/**
 * renderPage — drop-in replacement for the unguarded switch in AppContent.
 * Pass the current page key, the authenticated user object, and setPage.
 *
 * Components (Dashboard, VendorManagement, etc.) are imported inside
 * App.jsx — pass them as `components` to avoid circular imports, or
 * import them here if you restructure into separate files.
 *
 * @param {string} page
 * @param {object} user
 * @param {Function} setPage
 * @param {object} components  — { Dashboard, VendorManagement, RFQPage, ... }
 */
export function renderPage(page, user, setPage, components) {
  if (!user) return null;

  // FIX: Block render entirely if role is not allowed for this page
  if (!canAccess(page, user.role)) {
    return <AccessDenied />;
  }

  const {
    Dashboard,
    VendorManagement,
    RFQPage,
    QuotationsPage,
    ApprovalsPage,
    PurchaseOrders,
    InvoicesPage,
    ActivityLogs,
    UsersManagement,
  } = components;

  switch (page) {
    case "dashboard":        return <Dashboard onNav={setPage} />;
    case "vendors":          return <VendorManagement />;
    case "rfqs":             return <RFQPage />;
    case "quotations":       return <QuotationsPage onNav={setPage} />;
    case "approvals":        return <ApprovalsPage onNav={setPage} />;
    case "purchase-orders":  return <PurchaseOrders />;
    case "invoices":         return <InvoicesPage />;
    case "activity-logs":    return <ActivityLogs />;
    case "users":            return <UsersManagement />;
    default:                 return <Dashboard onNav={setPage} />;
  }
}
