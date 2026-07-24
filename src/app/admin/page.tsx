"use client"; import { useState } from "react";
export default function AdminPage() {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [in_,setIn]=useState(false); const [ge,setGe]=useState(true);
  const [users]=useState([{name:"Ravi Kumar",email:"ravi@example.com",school:"DAV Public School",verified:true},{name:"Priya Singh",email:"priya@example.com",school:"KV Sector 12",verified:false}]);
  if(!in_)return <div className="max-w-sm mx-auto px-4 py-12 fade-in">
    <h1 className="text-3xl font-serif font-bold text-maroon text-center mb-6">Admin Login</h1><hr className="double-rule max-w-xs mx-auto mb-8" />
    <form onSubmit={e=>{e.preventDefault();if(u==="admin"&&p==="admin")setIn(true);else alert("Invalid")}} className="parchment-card rounded-lg p-8 space-y-4">
      <div><label className="block text-sm font-semibold text-ink-light mb-1">Username</label><input value={u} onChange={e=>setU(e.target.value)} className="w-full px-3 py-2 rounded"/></div>
      <div><label className="block text-sm font-semibold text-ink-light mb-1">Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} className="w-full px-3 py-2 rounded"/></div>
      <button type="submit" className="btn-maroon w-full py-3 rounded-lg font-serif font-bold">Enter Admin Panel</button>
    </form></div>;
  return <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
    <h1 className="text-3xl font-serif font-bold text-maroon mb-2">Admin Dashboard</h1><hr className="single-rule mb-6" />
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="parchment-card rounded-lg p-6"><h2 className="font-serif font-bold text-lg text-maroon mb-3">Settings</h2>
        <div className="flex items-center justify-between"><span className="text-ink-light">Guest Login</span>
          <button onClick={()=>setGe(!ge)} className={`px-4 py-1.5 rounded text-sm font-semibold text-white ${ge?"bg-green-700":"bg-red-700"}`}>{ge?"Enabled":"Disabled"}</button></div></div>
      <div className="parchment-card rounded-lg p-6"><h2 className="font-serif font-bold text-lg text-maroon mb-3">Content Modules</h2>
        <ul className="space-y-1 text-sm text-ink-light"><li><strong>A</strong> — Grammar <span className="text-green-700">(active)</span></li>
          <li><strong>B</strong> — Math <span className="text-amber-600">(coming soon)</span></li><li><strong>C</strong> — Science <span className="text-amber-600">(coming soon)</span></li></ul></div>
    </div>
    <div className="parchment-card rounded-lg p-6"><h2 className="font-serif font-bold text-lg text-maroon mb-3">Registered Users</h2>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left">
        <thead><tr className="border-b border-gold/30 text-ink-light"><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">School</th><th className="py-2">Status</th></tr></thead>
        <tbody>{users.map((u,i)=><tr key={i} className="border-b border-amber-100">
          <td className="py-2 pr-4">{u.name}</td><td className="py-2 pr-4">{u.email}</td><td className="py-2 pr-4">{u.school}</td>
          <td className="py-2">{u.verified?<span className="text-green-700">Verified</span>:<span className="text-red-600">Pending</span>}</td></tr>)}</tbody></table></div>
    </div></div>;
}
