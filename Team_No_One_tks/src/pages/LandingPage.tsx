import { Link } from "react-router-dom"
import { ArrowRight, Activity, Zap, ShieldCheck } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-medium">Solar Cell Efficiency Optimizer v1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-primary">
          Predict Solar Output with <br className="hidden md:block"/> ML Precision
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Empowering solar engineers and farm operators with real-time, non-linear predictions for cell efficiency using advanced Random Forest and Ridge Regression models.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_40px_-10px] shadow-primary flex items-center justify-center gap-2 group"
          >
            Start Predicting <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 border border-white/10 glass-panel font-medium rounded-lg hover:bg-white/5 transition-all text-white"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-8 py-20 border-t border-white/10">
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left space-y-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Real-Time Inference</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Get predictions in under 2 seconds. Our models evaluate irradiance, temperature, wind, and humidity to provide highly accurate efficiency scores.
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left space-y-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Multiple ML Models</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Compare predictions confidently across Random Forest, Ridge, and Linear Regression models to guarantee the optimal setup configuration.
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left space-y-4 hover:-translate-y-2 transition-transform duration-300">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Secure & Collaborative</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Role-based access controls ensure that admins, engineers, and operators have exactly the access they need to predictive histories and analytics.
          </p>
        </div>
      </div>
    </div>
  )
}
