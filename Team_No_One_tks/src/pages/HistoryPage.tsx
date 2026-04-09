import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"

const MOCK_HISTORY = [
  { id: "1a", date: "2026-04-09 10:42", irrad: 850, temp: 24, mod: "Random Forest", eff: "18.42%" },
  { id: "2b", date: "2026-04-08 14:15", irrad: 920, temp: 28, mod: "Ridge Regression", eff: "17.80%" },
  { id: "3c", date: "2026-04-08 09:30", irrad: 700, temp: 21, mod: "Random Forest", eff: "19.11%" },
  { id: "4d", date: "2026-04-07 11:20", irrad: 1050, temp: 32, mod: "Linear Regression", eff: "16.55%" },
  { id: "5e", date: "2026-04-07 16:45", irrad: 500, temp: 18, mod: "Random Forest", eff: "20.10%" },
]

export function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Prediction History</h1>
        <p className="text-muted-foreground max-w-2xl">
          Review all past inferences, compare model performance, and export data for your records.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inference Log</CardTitle>
          <CardDescription>Your last 50 remote predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/50 text-muted-foreground text-xs uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Date / Time</th>
                  <th className="px-6 py-4 font-medium">Irradiance</th>
                  <th className="px-6 py-4 font-medium">Amb. Temp</th>
                  <th className="px-6 py-4 font-medium">Model Used</th>
                  <th className="px-6 py-4 font-medium text-right">Predicted Eff.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_HISTORY.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{row.date}</td>
                    <td className="px-6 py-4">{row.irrad} W/m²</td>
                    <td className="px-6 py-4">{row.temp} °C</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium border border-white/5">
                        {row.mod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">{row.eff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
