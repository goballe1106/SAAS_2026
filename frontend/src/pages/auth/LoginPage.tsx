import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Building2, Loader2, Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@erp.com')
  const [password, setPassword] = useState('Admin123!')
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setIsSuccess(false)
    
    try {
      await login(email, password)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch {
      // error is set in store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl mb-4 relative">
            <Building2 className="h-10 w-10 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-slate-900"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ERP SAS</h1>
          <p className="text-blue-200">Sistema de Gestión Empresarial</p>
        </div>

        {/* Login card */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">Bienvenido</CardTitle>
              <CardDescription className="text-blue-200">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success message */}
            {isSuccess && (
              <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <p className="text-green-300 text-sm">Login exitoso. Redirigiendo...</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200 text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-200 text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-blue-200">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-offset-0"
                  />
                  Recordarme
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium py-3 shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Accediendo...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-center text-xs text-blue-300 mb-2">
                Credenciales de demostración:
              </p>
              <div className="text-center space-y-1">
                <code className="text-xs bg-white/10 px-2 py-1 rounded text-blue-200">
                  admin@erp.com
                </code>
                <br />
                <code className="text-xs bg-white/10 px-2 py-1 rounded text-blue-200">
                  Admin123!
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200/60 text-sm">
          <p>© 2026 ERP SAS - Todos los derechos reservados</p>
          <p className="mt-1">
            Versión 1.0.0 | 
            <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">
              Términos y condiciones
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
