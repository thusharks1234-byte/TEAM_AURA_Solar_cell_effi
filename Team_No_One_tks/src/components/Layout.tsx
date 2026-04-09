import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sun, LogOut } from "lucide-react"
import { useStore } from "../store/useStore"
import { cn } from "../lib/utils"

export function Navbar() {
  const { session, setSession } = useStore()
  const location = useLocation()
  
  const handleLogout = () => {
    setSession(null)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={session ? "/dashboard" : "/"} className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Sun className="h-6 w-6" />
          <span>SolarPredict<span className="text-foreground font-light">Pro</span></span>
        </Link>
        
        {session ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-sm font-medium">
              <Link to="/dashboard" className={cn("hover:text-primary transition-colors", location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground")}>Dashboard</Link>
              <Link to="/predict" className={cn("hover:text-primary transition-colors", location.pathname === "/predict" ? "text-primary" : "text-muted-foreground")}>Predict</Link>
              <Link to="/history" className={cn("hover:text-primary transition-colors", location.pathname === "/history" ? "text-primary" : "text-muted-foreground")}>History</Link>
              {(session.role === 'admin' || session.role === 'engineer') && (
                <Link to="/analytics" className={cn("hover:text-primary transition-colors", location.pathname === "/analytics" ? "text-primary" : "text-muted-foreground")}>Analytics</Link>
              )}
               {session.role === 'admin' && (
                <Link to="/admin" className={cn("hover:text-primary transition-colors", location.pathname === "/admin" ? "text-primary" : "text-muted-foreground")}>Admin</Link>
              )}
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">{session.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{session.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>© 2026 SolarPredict Pro. All rights reserved.</p>
        <p>Driving SDG 7 (Clean Energy) & SDG 13 (Climate Action)</p>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-slate-50 relative overflow-hidden bg-background">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="pointer-events-none fixed top-1/2 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
      
      <Navbar />
      <main className="flex-1 flex flex-col w-full z-10 relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}
