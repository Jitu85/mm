"use client"; import { useState } from "react"; import { useRouter } from "next/navigation";
const countries=["India","United States","United Kingdom","Canada","Australia","Germany","France","Japan","Brazil","South Africa"];
export default function SignUpPage() {
  const r=useRouter(); const [f,setF]=useState({fullName:"",age:"",classGrade:"",school:"",email:"",phone:"",country:""});
  const [otp,setOtp]=useState(""); const [sent,setSent]=useState(false); const [v,setV]=useState(false); const [msg,setMsg]=useState("");
  const hc=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>setF({...f,[e.target.name]:e.target.value});
  const send=()=>{setMsg("OTP sent (demo: 123456)");setSent(true)};
  const verify=()=>{if(otp==="123456"){setV(true);setMsg("Verified!")}else setMsg("Incorrect Code, try again")};
  const submit=(e:React.FormEvent)=>{e.preventDefault();if(!v){setMsg("Verify email first");return}setMsg("Account created!");setTimeout(()=>r.push("/login"),1500)};
  return <div className="max-w-2xl mx-auto px-4 py-8 fade-in">
    <h1 className="text-3xl font-serif font-bold text-maroon text-center mb-6">Create Your Account</h1><hr className="double-rule max-w-xs mx-auto mb-8" />
    <form onSubmit={submit} className="parchment-card rounded-lg p-8 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {[{n:"fullName",l:"Full Name",t:"text"},{n:"age",l:"Age",t:"number",m:"4",x:"18"},{n:"classGrade",l:"Class/Grade",t:"text"},{n:"school",l:"School Name",t:"text"},
          {n:"email",l:"Email ID",t:"email"},{n:"phone",l:"Phone Number",t:"tel"}].map(c=>
          <div key={c.n}><label className="block text-sm font-semibold text-ink-light mb-1">{c.l}</label>
            <input name={c.n} type={c.t} min={c.m} max={c.x} value={(f as any)[c.n]} onChange={hc} required className="w-full px-3 py-2 rounded"/></div>)}
        <div><label className="block text-sm font-semibold text-ink-light mb-1">Country</label>
          <select name="country" value={f.country} onChange={hc} required className="w-full px-3 py-2 rounded">
            <option value="">Select</option>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <hr className="single-rule"/>
      <div className="bg-amber-50 border border-gold/30 rounded-lg p-4">
        <h3 className="font-serif font-bold text-maroon mb-2">Email Verification</h3>
        <div className="flex gap-2"><button type="button" onClick={send} className="btn-gold px-4 py-2 rounded text-sm font-semibold">Send OTP</button>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} className="flex-1 px-3 py-2 rounded"/>
          <button type="button" onClick={verify} className="btn-maroon px-4 py-2 rounded text-sm font-semibold">Verify</button></div>
        {v&&<p className="text-green-700 text-sm mt-2 font-semibold">Verified</p>}
      </div>
      {msg&&<p className="text-sm text-ink-light text-center">{msg}</p>}
      <button type="submit" className="btn-maroon w-full py-3 rounded-lg font-serif font-bold text-lg">Create Account</button>
    </form>
  </div>;
}
