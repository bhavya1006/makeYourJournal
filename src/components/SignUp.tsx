import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { SpaceAnimation } from './SpaceAnimation'
import { supabase } from '../lib/supabaseClient'

interface SignUpProps {
  onSuccess: (state: 'verify' | 'onboarding') => void
  onSwitchToSignIn: () => void
}

export function SignUp({ onSuccess, onSwitchToSignIn }: SignUpProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (!data.session) {
      onSuccess('verify')
    } else {
      onSuccess('onboarding')
    }
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
          <h1 className="text-3xl font-semibold">Create account</h1>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <Input className="pl-10" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>

            <div>
              <label>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <Input className="pl-10" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
                <Input className="pl-10" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? 'Creating…' : 'Create Account'}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          <div className="text-center">
            <button onClick={onSwitchToSignIn} className="text-primary text-sm">
              Already have an account? Sign in
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
