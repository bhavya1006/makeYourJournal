import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { SpaceAnimation } from './SpaceAnimation'
import { supabase } from '../lib/supabaseClient'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [loading, setLoading] = useState(false)

  const canSubmit = acceptedTerms && acceptedPrivacy

  const handleContinue = async () => {
    if (!canSubmit || loading) return

    setLoading(true)

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      setLoading(false)
      return
    }

    await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        accepted_terms: true,
        accepted_privacy: true,
        accepted_at: new Date().toISOString(),
      },
    })

    setLoading(false)
    onComplete()
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Mobile background */}
      <div className="lg:hidden absolute inset-0">
        <SpaceAnimation />
        <div className="absolute inset-0 backdrop-blur-md bg-white/80" />
      </div>

      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white relative z-10"
      >
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center">
              <Shield className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl">Before we begin</h1>
              <p className="text-muted-foreground">
                Please review and accept our terms
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <h3 className="text-xl">Terms of Service</h3>
            <div className="max-h-40 overflow-y-auto text-muted-foreground text-sm space-y-2">
              <p>You are responsible for your account security.</p>
              <p>No illegal or abusive usage.</p>
              <p>Service may change or end at any time.</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t">
              <Checkbox
                checked={acceptedTerms}
                onCheckedChange={(v: boolean) => setAcceptedTerms(v as boolean)}
              />
              <span>I agree to the Terms of Service</span>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <h3 className="text-xl">Privacy Policy</h3>
            <div className="max-h-40 overflow-y-auto text-muted-foreground text-sm space-y-2">
              <p>We collect only necessary data.</p>
              <p>Your data is encrypted and secure.</p>
              <p>You may request deletion anytime.</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t">
              <Checkbox
                checked={acceptedPrivacy}
                onCheckedChange={(v: boolean) => setAcceptedPrivacy(v as boolean)}
              />
              <span>I agree to the Privacy Policy</span>
            </div>
          </div>

          <Button
            disabled={!canSubmit || loading}
            onClick={handleContinue}
            className="w-full h-11"
          >
            {loading ? 'Saving…' : 'Continue to Dashboard'}
            <Check className="ml-2 size-4" />
          </Button>
        </div>
      </motion.div>

      {/* RIGHT */}
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
