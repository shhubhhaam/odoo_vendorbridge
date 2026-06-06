import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("admin@vendorbridge.com");
  const [pass, setPass] = useState("password");
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{ width: 80 + i * 80, height: 80 + i * 80, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏗️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Streamline Your Procurement</h2>
          <p className="text-blue-200 text-base max-w-xs mx-auto leading-relaxed">End-to-end vendor management, RFQs, approvals and purchase orders — all in one platform.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[["500+", "Vendors Managed"], ["₹50Cr+", "Spend Tracked"], ["99.9%", "Uptime SLA"], ["4.9★", "User Rating"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{v}</p>
                <p className="text-blue-300 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">VB</div>
            <div>
              <p className="font-bold text-gray-900">VendorBridge</p>
              <p className="text-xs text-gray-400">Enterprise Procurement ERP</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-7">Sign in to your account to continue</p>
          <div className="space-y-4">
            <Field label="Email Address" required>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{show ? "Hide" : "Show"}</button>
              </div>
            </Field>
            <div className="flex justify-end">
              <button className="text-xs text-blue-600 hover:underline">Forgot password?</button>
            </div>
            <Btn size="lg" onClick={onLogin} className="w-full justify-center">Sign In to VendorBridge</Btn>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <button onClick={onRegister} className="text-blue-600 font-medium hover:underline">Create Account</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;