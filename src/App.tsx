import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { SignIn } from './components/SignIn'
import { SignUp } from './components/SignUp'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './components/Dashboard'

type AppState = 'signin' | 'signup' | 'onboarding' | 'dashboard'

export default function App() {
  const [appState, setAppState] = useState<AppState>('signin')
  const [user, setUser] = useState<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setAppState('signin')
        setReady(true)
        return
      }

      const onboardingDone =
        session.user.user_metadata?.onboarding_completed === true

      setUser(session.user)
      setAppState(onboardingDone ? 'dashboard' : 'onboarding')
      setReady(true)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null)
          setAppState('signin')
          return
        }

        const onboardingDone =
          session.user.user_metadata?.onboarding_completed === true

        setUser(session.user)
        setAppState(onboardingDone ? 'dashboard' : 'onboarding')
      }
    )

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  if (!ready) return null

  return (
    <div className="min-h-screen">
      {appState === 'signin' && (
        <SignIn
          onSuccess={() => setAppState('dashboard')}
          onSwitchToSignUp={() => setAppState('signup')}
        />
      )}

      {appState === 'signup' && (
        <SignUp
          onSuccess={() => setAppState('onboarding')}
          onSwitchToSignIn={() => setAppState('signin')}
        />
      )}

      {appState === 'onboarding' && (
        <Onboarding onComplete={() => setAppState('dashboard')} />
      )}

      {appState === 'dashboard' && user && (
        <Dashboard
          userName={user.email}
          onSignOut={async () => {
            await supabase.auth.signOut()
            setAppState('signin')
          }}
        />
      )}
    </div>
  )
}
