import { Link } from "react-router-dom"
import { ArrowRight, BarChart3, TrendingUp, SunSnow, Clock } from "lucide-react"
import { useStore } from "../store/useStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export function Dashboard() {
  const { session } = useStore()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Predictions</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">18.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all recent arrays</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best R² Score</CardTitle>
            <SunSnow className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">0.962</div>
            <p className="text-xs text-muted-foreground mt-1">Random Forest Model</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Computed</CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">2 mins ago</div>
            <p className="text-xs text-muted-foreground mt-1">By Operator ID: 492</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Predict Widget */}
        <Card className="col-span-1 lg:col-span-1 bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle>Quick Predict</CardTitle>
            <CardDescription>Run a fast test with average conditions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-1"><span>Irradiance:</span> <span className="font-mono text-white">850 W/m²</span></div>
              <div className="flex justify-between border-b border-white/5 pb-1"><span>Amb. Temp:</span> <span className="font-mono text-white">24 °C</span></div>
              <div className="flex justify-between border-b border-white/5 pb-1"><span>Humidity:</span> <span className="font-mono text-white">45 %</span></div>
            </div>
            <Link to="/predict">
              <Button className="w-full mt-4">Run Default Params</Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Your latest historical runs across all models.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2bg-primary/20 rounded text-primary font-mono text-xl p-2 bg-slate-900 border border-slate-700 font-bold">
                       {i === 1 ? '19.2%' : i === 2 ? '17.8%' : '18.4%'}
                    </div>
                    <div>
                      <div className="font-medium text-white">Random Forest Model</div>
                      <div className="text-xs text-muted-foreground">Irrad: {900 - i*50} • Temp: 2{i}°C</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{i * 2} hrs ago</div>
                    <Link to="/history" className="text-xs text-primary hover:underline">View details</Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link to="/history" className="w-full">
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                View All History <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
