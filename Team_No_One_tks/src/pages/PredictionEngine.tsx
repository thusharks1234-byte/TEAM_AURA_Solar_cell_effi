import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Zap, Activity, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input, Label } from "../components/ui/Input"

const predictSchema = z.object({
  irradiance: z.coerce.number().min(0.1, "Must be > 0").max(1500, "Max is 1500"),
  ambient_temp: z.coerce.number().min(-40, "Min -40°C").max(80, "Max 80°C"),
  module_temp: z.coerce.number().min(-40, "Min -40°C").max(100, "Max 100°C"),
  humidity: z.coerce.number().min(0, "Min 0%").max(100, "Max 100%"),
  wind_speed: z.coerce.number().min(0, "Min 0 m/s").max(50, "Max 50 m/s"),
  sunshine_hours: z.coerce.number().min(0, "Min 0").max(24, "Max 24"),
  model_used: z.enum(["random_forest", "ridge", "linear"]),
})

export function PredictionEngine() {
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<{ eff: number; model: string; r2: number } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(predictSchema),
    defaultValues: {
      irradiance: 850,
      ambient_temp: 24,
      module_temp: 35,
      humidity: 45,
      wind_speed: 2.5,
      sunshine_hours: 8,
      model_used: "random_forest",
    }
  })

  const onSubmit = (data: { irradiance: number; ambient_temp: number; module_temp: number; humidity: number; wind_speed: number; sunshine_hours: number; model_used: string; }) => {
    setIsPredicting(true)
    setResult(null)
    
    // Simulate API call to ML backend
    setTimeout(() => {
      // Mock logic to perturb result slightly based on model
      let baseEff = 18.0 + (data.irradiance / 1000) * 2 - (data.module_temp / 100) * 0.5
      baseEff = Math.max(5, Math.min(25, baseEff)) // bind between 5% and 25%
      
      setResult({
        eff: parseFloat(baseEff.toFixed(2)),
        model: data.model_used,
        r2: data.model_used === 'random_forest' ? 0.94 : data.model_used === 'ridge' ? 0.89 : 0.81
      })
      setIsPredicting(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Prediction Engine</h1>
        <p className="text-muted-foreground max-w-2xl">
          Enter environmental and module parameters below to run a real-time ML inference on solar cell efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Fill out all parameters for an accurate prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="predict-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="irradiance">Solar Irradiance (W/m²)</Label>
                  <Input id="irradiance" type="number" step="0.1" {...register("irradiance")} />
                  {errors.irradiance && <p className="text-sm text-destructive">{errors.irradiance.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ambient_temp">Ambient Temp (°C)</Label>
                  <Input id="ambient_temp" type="number" step="0.1" {...register("ambient_temp")} />
                  {errors.ambient_temp && <p className="text-sm text-destructive">{errors.ambient_temp.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="module_temp">Module Temp (°C)</Label>
                  <Input id="module_temp" type="number" step="0.1" {...register("module_temp")} />
                  {errors.module_temp && <p className="text-sm text-destructive">{errors.module_temp.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input id="humidity" type="number" step="0.1" {...register("humidity")} />
                  {errors.humidity && <p className="text-sm text-destructive">{errors.humidity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wind_speed">Wind Speed (m/s)</Label>
                  <Input id="wind_speed" type="number" step="0.1" {...register("wind_speed")} />
                  {errors.wind_speed && <p className="text-sm text-destructive">{errors.wind_speed.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sunshine_hours">Sunshine Hours / day</Label>
                  <Input id="sunshine_hours" type="number" step="0.1" {...register("sunshine_hours")} />
                  {errors.sunshine_hours && <p className="text-sm text-destructive">{errors.sunshine_hours.message}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <Label>Model Selection</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'random_forest', name: 'Random Forest', desc: 'Highest precision, handles non-linearities' },
                    { id: 'ridge', name: 'Ridge Regression', desc: 'Prevents overfitting, good baseline' },
                    { id: 'linear', name: 'Linear Regression', desc: 'Fastest, simple correlation' },
                  ].map((model) => (
                    <label key={model.id} className="relative cursor-pointer">
                      <input 
                        type="radio" 
                        value={model.id} 
                        {...register("model_used")} 
                        className="peer sr-only" 
                      />
                      <div className="p-4 rounded-lg border border-white/10 bg-slate-900/40 peer-checked:bg-primary/10 peer-checked:border-primary/50 transition-all">
                        <div className="font-semibold text-sm text-white">{model.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{model.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </form>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-6">
             <Button form="predict-form" type="submit" disabled={isPredicting} className="w-full sm:w-auto h-12 px-8">
               {isPredicting ? (
                 <>
                   <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white mr-3" />
                   Running Inference...
                 </>
               ) : (
                 <>
                   <Zap className="h-5 w-5 mr-2" />
                   Run Prediction
                 </>
               )}
             </Button>
          </CardFooter>
        </Card>

        {/* Results Column */}
        <div className="space-y-6">
          <Card className={`overflow-hidden relative transition-all duration-500 ${result ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70'}`}>
            {result && (
               <div className="absolute top-0 right-0 p-3 bg-primary/20 rounded-bl-xl text-primary">
                 <Activity className="h-6 w-6" />
               </div>
            )}
            <CardHeader>
              <CardTitle>Inference Result</CardTitle>
              <CardDescription>
                {result ? "Prediction completed successfully." : "Waiting for input..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-xl border border-white/5 shadow-inner">
                    <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">Predicted Efficiency</span>
                    <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-primary">
                      {result.eff}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-muted-foreground mb-1">Model</div>
                      <div className="font-medium capitalize text-white">{result.model.replace('_', ' ')}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-muted-foreground mb-1">Confidence (R²)</div>
                      <div className="font-medium text-white">{result.r2.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Info className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm">Submit the form to see ML inference results here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
