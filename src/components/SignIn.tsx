import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Lock, ArrowRight, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { SpaceAnimation } from './SpaceAnimation'
import { supabase } from '../lib/supabaseClient'

interface SignInProps {
  onSuccess: () => void
  onSwitchToSignUp: () => void
}

interface Toast {
  id: number
  message: string
  type: 'info' | 'error'
  duration: number
}

export function SignIn({ onSuccess, onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration)
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      const msg = error.message.toLowerCase()

      if (msg.includes('invalid')) {
        addToast({
          message: 'Invalid credentials. Please check your password.',
          type: 'error',
          duration: 4000,
        })
      } else {
        addToast({
          message: 'Account not found. Please sign up.',
          type: 'info',
          duration: 3000,
        })
      }
      return
    }

    onSuccess()
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <div className="lg:hidden absolute inset-0">
        <SpaceAnimation />
        <div className="absolute inset-0 backdrop-blur-md bg-white/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 bg-white relative z-10"
      >
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-semibold">Welcome back</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <Input
                  className="pl-10"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <Input
                  className="pl-10"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign In'}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          {/* Toasts below button */}
          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {toasts.map(toast => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-lg p-3 flex gap-3 text-sm ${
                    toast.type === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  <span className="flex-1">{toast.message}</span>
                  <button onClick={() => removeToast(toast.id)}>
                    <X className="size-4 opacity-70 hover:opacity-100" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <button
              onClick={onSwitchToSignUp}
              className="text-primary text-sm"
            >
              Don’t have an account? Sign up
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 relative overflow-hidden"
      >
        <SpaceAnimation />
      </motion.div>
    </div>
  )
}
