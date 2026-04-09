import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"

const featureData = [
  { name: 'Irradiance', importance: 0.42 },
  { name: 'Module Temp', importance: 0.28 },
  { name: 'Amb. Temp', importance: 0.15 },
  { name: 'Wind Speed', importance: 0.08 },
  { name: 'Humidity', importance: 0.04 },
  { name: 'Sun Hours', importance: 0.03 },
]

const scatterData = Array.from({ length: 40 }).map(() => ({
  x: Math.random() * 800 + 200, // irradiance
  y: Math.random() * 10 + 10,   // efficiency
}))

export function Analytics() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">ML Analytics</h1>
        <p className="text-muted-foreground max-w-2xl">
          Deep dive into feature importance and model correlation data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Random Forest derived Gini impurity decrease.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#3b82f6' }}
                    cursor={{fill: '#1e293b'}}
                  />
                  <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Irradiance vs Efficiency</CardTitle>
            <CardDescription>Sample of the last 40 inferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="x" name="Irradiance" unit="W/m²" stroke="#94a3b8" />
                  <YAxis type="number" dataKey="y" name="Efficiency" unit="%" stroke="#94a3b8" />
                  <Tooltip 
                     cursor={{strokeDasharray: '3 3'}}
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  />
                  <Scatter name="Inferences" data={scatterData} fill="#8b5cf6">
                    {scatterData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={'#8b5cf6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
