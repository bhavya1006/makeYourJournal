// import { useState, useEffect } from 'react';
// import { SignIn } from './components/SignIn';
// import { SignUp } from './components/SignUp';
// import { Onboarding } from './components/Onboarding';
// import { Dashboard } from './components/Dashboard';

// type AppState = 'signin' | 'signup' | 'onboarding' | 'dashboard';

// interface User {
//   name: string;
//   email: string;
//   onboarded: boolean;
// }

// export default function App() {
//   const [appState, setAppState] = useState<AppState>('signin');
//   const [user, setUser] = useState<User | null>(null);

//   // Check if user is already logged in
//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       const parsedUser = JSON.parse(savedUser);
//       setUser(parsedUser);
//       if (parsedUser.onboarded) {
//         setAppState('dashboard');
//       } else {
//         setAppState('onboarding');
//       }
//     }
//   }, []);

//   const handleSignIn = (email: string, password: string) => {
//     // In a real app, this would validate credentials
//     // For now, check if user exists in localStorage
//     const savedUsers = localStorage.getItem('users');
//     if (savedUsers) {
//       const users = JSON.parse(savedUsers);
//       const foundUser = users.find((u: any) => u.email === email);
//       if (foundUser) {
//         setUser(foundUser);
//         localStorage.setItem('user', JSON.stringify(foundUser));
//         if (foundUser.onboarded) {
//           setAppState('dashboard');
//         } else {
//           setAppState('onboarding');
//         }
//         return;
//       }
//     }
//     // If no user found, create a demo user
//     const demoUser = {
//       name: 'Demo User',
//       email,
//       onboarded: false,
//     };
//     setUser(demoUser);
//     localStorage.setItem('user', JSON.stringify(demoUser));
//     setAppState('onboarding');
//   };

//   const handleSignUp = (name: string, email: string, password: string) => {
//     const newUser = {
//       name,
//       email,
//       onboarded: false,
//     };

//     // Save user to localStorage
//     const savedUsers = localStorage.getItem('users');
//     const users = savedUsers ? JSON.parse(savedUsers) : [];
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));
//     localStorage.setItem('user', JSON.stringify(newUser));

//     setUser(newUser);
//     setAppState('onboarding');
//   };

//   const handleOnboardingComplete = () => {
//     if (user) {
//       const updatedUser = { ...user, onboarded: true };
//       setUser(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));

//       // Update in users list
//       const savedUsers = localStorage.getItem('users');
//       if (savedUsers) {
//         const users = JSON.parse(savedUsers);
//         const updatedUsers = users.map((u: any) =>
//           u.email === user.email ? updatedUser : u
//         );
//         localStorage.setItem('users', JSON.stringify(updatedUsers));
//       }

//       setAppState('dashboard');
//     }
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     setAppState('signin');
//   };

//   return (
//     <div className="min-h-screen">
//       {appState === 'signin' && (
//         <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAppState('signup')} />
//       )}
//       {appState === 'signup' && (
//         <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAppState('signin')} />
//       )}
//       {appState === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
//       {appState === 'dashboard' && user && (
//         <Dashboard userName={user.name} onSignOut={handleSignOut} />
//       )}
//     </div>
//   );
// }
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

  // Restore Supabase session on refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAppState(data.session ? 'dashboard' : 'signin')
      setReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAppState(session ? 'dashboard' : 'signin')
    })

    return () => sub.subscription.unsubscribe()
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
          }}
        />
      )}
    </div>
  )
}
