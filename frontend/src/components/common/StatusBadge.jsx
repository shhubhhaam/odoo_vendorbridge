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