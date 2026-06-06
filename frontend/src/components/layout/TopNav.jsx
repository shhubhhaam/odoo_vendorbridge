function TopNav({ title, onNotification }) {
  return (
    <header className="fixed left-56 right-0 top-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400">Procurement & Vendor Management</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500" onClick={onNotification}>
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">RG</div>
          <div className="text-xs">
            <p className="font-medium text-gray-800">Rajesh Gupta</p>
          </div>
          <span className="text-gray-400 text-xs">▼</span>
        </div>
      </div>
    </header>
  );
}