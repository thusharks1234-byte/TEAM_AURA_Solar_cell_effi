import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sun, Globe, Mail } from "lucide-react"

import { useStore } from "../store/useStore"
import { Button } from "../components/ui/Button"
import { Input, Label } from "../components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card"

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type AuthFormValues = z.infer<typeof authSchema>

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate()
  const { setSession } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })
  
  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true)
    // MOCK LOGIN OR REGISTER
    setTimeout(() => {
      setSession({
        id: crypto.randomUUID(),
        email: data.email,
        name: data.email.split('@')[0],
        role: "engineer", // default mocked role
        organization: "Solar Co."
      })
      navigate("/dashboard")
      setIsLoading(false)
    }, 800)
  }
  
  // MOCK OAUTH
  const handleOAuth = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSession({
        id: crypto.randomUUID(),
        email: "oauth_user@example.com",
        name: "OAuth User",
        role: "admin", 
        organization: "Acme Solar"
      })
      navigate("/dashboard")
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="flex items-center justify-center flex-1 py-12 px-4 sm:px-6lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center justify-center pb-8 border-b border-white/5 mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
             <Sun className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl text-center">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "login" 
              ? "Enter your email to sign in to your account" 
              : "Enter your details below to create your account"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="m@example.com" 
                type="email" 
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Please wait...
                </span>
              ) : mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground glass-panel.bg-transparent">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading} onClick={handleOAuth} className="bg-transparent">
              <Globe className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" type="button" disabled={isLoading} onClick={handleOAuth} className="bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-6 mt-4">
          <div className="text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </div>
          <Link 
            to={mode === "login" ? "/register" : "/login"} 
            className="text-sm text-primary hover:underline font-medium"
          >
            {mode === "login" ? "Register now" : "Sign in instead"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
