import { Bell } from "lucide-react";

function Navbar() {
  return (
    <div className="bg-white border-b p-4 flex justify-between">

      <h1 className="font-semibold text-xl">
        Dashboard
      </h1>

      <Bell />

    </div>
  );
}

export default Navbar;