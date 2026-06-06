import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Btn from "../../components/common/Button";
import { Field, Input, Select, Textarea } from "../../components/common/Field";

function Register({ onBack }) {
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("Procurement Officer");
  const fileRef = useRef();
  const handleFile = e => {
    const f = e.target.files[0];
    if (f) setAvatar(URL.createObjectURL(f));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-900 px-8 py-5 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">VB</div>
          <p className="text-white font-semibold">VendorBridge — Create Account</p>
        </div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div onClick={() => fileRef.current.click()} className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
              </div>
              <button onClick={() => fileRef.current.click()} className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">+</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required><Input placeholder="Rajesh" /></Field>
            <Field label="Last Name" required><Input placeholder="Gupta" /></Field>
            <Field label="Email Address" required><Input type="email" placeholder="rajesh@company.com" /></Field>
            <Field label="Password" required>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
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
            <Field label="Phone Number"><Input type="tel" placeholder="+91 98765 43210" /></Field>
            <Field label="Role" required>
              <Select value={role} onChange={e => setRole(e.target.value)}>
                <option>Procurement Officer</option>
                <option>Vendor</option>
                <option>Manager / Approver</option>
                <option>Admin</option>
              </Select>
            </Field>
            <Field label="Country" required>
              <Select>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Singapore</option>
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="Additional Information">
                <Textarea rows={3} placeholder="Tell us about your organization and procurement needs…" />
              </Field>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Btn size="md" onClick={onBack} variant="secondary">← Back to Login</Btn>
            <Btn size="md" className="flex-1 justify-center">Create Account</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;