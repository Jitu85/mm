"use client"; import Link from "next/link"; import { usePathname } from "next/navigation";
export default function NavBar() {
  const p = usePathname();
  const logged = typeof window !== "undefined" && localStorage.getItem("token");
  const isGrammar = p.startsWith("/grammar");
  const isQA = p.startsWith("/module/B") || p.startsWith("/qa");

  return <nav className="sticky top-0 z-50 bg-maroon text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-serif text-xl font-bold tracking-wide">Virtual Classroom</Link>
      <div className="flex items-center gap-4 text-sm font-serif">
        {isGrammar && <Link href="/grammar" className="hover:text-gold-light transition-colors">Grammar Index</Link>}
        {isQA && <Link href="/module/B" className="hover:text-gold-light transition-colors font-semibold">Q&A Arena</Link>}
        <Link href="/" className="hover:text-gold-light transition-colors">Home</Link>
        {logged ? <>
          <Link href="/dashboard" className="hover:text-gold-light">Dashboard</Link>
          <button onClick={()=>{localStorage.removeItem("token");localStorage.removeItem("user");window.location.href="/"}} className="hover:text-gold-light">Logout</button>
        </>
        : <>
          <Link href="/login" className="hover:text-gold-light">Login</Link>
          <Link href="/signup" className="hover:text-gold-light">Sign Up</Link>
        </>}
      </div>
    </div>
  </nav>;
}
