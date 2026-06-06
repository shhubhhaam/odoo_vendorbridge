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

export default Btn;