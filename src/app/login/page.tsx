"use client"; import { useState } from "react"; import { useRouter } from "next/navigation";
export default function LoginPage() {
  const r=useRouter(); const [e,setE]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const h=(ev:React.FormEvent)=>{ev.preventDefault();if(!e||!p){setErr("Fill all fields");return}
    localStorage.setItem("token","demo-token");localStorage.setItem("user",JSON.stringify({email:e,name:"Student",role:"student"}));r.push("/dashboard")};
  return <div className="max-w-md mx-auto px-4 py-12 fade-in">
    <h1 className="text-3xl font-serif font-bold text-maroon text-center mb-6">Login</h1><hr className="double-rule max-w-xs mx-auto mb-8" />
    <form onSubmit={h} className="parchment-card rounded-lg p-8 space-y-4">
      <div><label className="block text-sm font-semibold text-ink-light mb-1">Email</label><input type="email" value={e} onChange={e=>setE(e.target.value)} required className="w-full px-3 py-2 rounded"/></div>
      <div><label className="block text-sm font-semibold text-ink-light mb-1">Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} required className="w-full px-3 py-2 rounded"/></div>
      {err&&<p className="text-red-600 text-sm">{err}</p>}
      <button type="submit" className="btn-maroon w-full py-3 rounded-lg font-serif font-bold text-lg">Sign In</button>
      <p className="text-center text-sm text-ink-light">Don&apos;t have an account? <a href="/signup" className="text-maroon underline">Sign up</a></p>
    </form>
  </div>;
}
