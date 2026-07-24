import type { Metadata } from "next"; import "./globals.css"; import NavBar from "@/components/NavBar";
export const metadata: Metadata = { title: "Virtual Classroom", description: "A digital place where kids not just see and hear, but also interact." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="min-h-screen flex flex-col"><NavBar /><main className="flex-1">{children}</main>
    <footer className="text-center py-4 text-sm text-ink-light border-t border-gold/30 bg-parchment-dark/50">Developed and designed by Abhijit Kumar Misra</footer>
  </body></html>;
}
