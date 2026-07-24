"use client"; import Link from "next/link"; import { useRouter } from "next/navigation"; import Carousel from "@/components/Carousel";
export default function LandingPage() {
  const r = useRouter();
  const guestLogin = () => { localStorage.setItem("token", "guest-token"); localStorage.setItem("user", JSON.stringify({ name: "Guest", role: "guest" })); r.push("/dashboard"); };
  return <div className="max-w-6xl mx-auto px-4 py-8 fade-in">
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-maroon mb-2">Virtual Classroom</h1>
      <p className="text-lg text-ink-light italic font-serif">&ldquo;A digital place where kids not just see and hear, but also interact.&rdquo;</p>
      <hr className="double-rule max-w-md mx-auto" />
    </div>
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-3 h-full"><Carousel /></div>
      <div className="md:col-span-2 flex flex-col gap-4">
        {[{href:"/login",title:"Login",desc:"Returning students — sign in here",extra:"border-maroon/30"},
          {href:"/signup",title:"Sign Up",desc:"New here? Create your account"},
          {href:"#",title:"Guest Login",desc:"Explore without registering (demo mode)",extra:"border-amber-600/30",action:guestLogin},
          {href:"/admin",title:"Admin Login",desc:"Administrator access only",extra:"border-maroon/20 bg-maroon/5"},
        ].map(c=> c.action ? <div key={c.title} onClick={c.action} className="block cursor-pointer">
          <div className={`parchment-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow ${c.extra||""}`}>
            <h3 className="font-serif text-xl font-bold text-maroon mb-1">{c.title}</h3>
            <p className="text-sm text-ink-light">{c.desc}</p></div></div>
        : <Link key={c.href} href={c.href} className="block">
          <div className={`parchment-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer ${c.extra||""}`}>
            <h3 className="font-serif text-xl font-bold text-maroon mb-1">{c.title}</h3>
            <p className="text-sm text-ink-light">{c.desc}</p></div></Link>)}
      </div>
    </div>
  </div>;
}
