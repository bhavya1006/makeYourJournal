import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SpaceAnimation } from './SpaceAnimation';

interface SignUpProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onSwitchToSignIn: () => void;
}

export function SignUp({ onSignUp, onSwitchToSignIn }: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onSignUp(name, email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Background Animation for Mobile - Blurred */}
      <div className="lg:hidden absolute inset-0">
        <SpaceAnimation />
        <div className="absolute inset-0 backdrop-blur-md bg-white/80" />
      </div>

      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white lg:bg-white relative z-10"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="mb-2 text-2xl sm:text-3xl">Create your account</h1>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Start your productivity journey today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm sm:text-base">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-input-background border-border/50 rounded-lg h-11 sm:h-12 transition-all focus:border-primary/20 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm sm:text-base">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input-background border-border/50 rounded-lg h-11 sm:h-12 transition-all focus:border-primary/20 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm sm:text-base">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-input-background border-border/50 rounded-lg h-11 sm:h-12 transition-all focus:border-primary/20 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all group mt-4 sm:mt-6 text-sm sm:text-base"
              >
                <span>Create Account</span>
                <ArrowRight className="ml-2 size-3.5 sm:size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={onSwitchToSignIn}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              >
                Already have an account? <span className="text-primary">Sign in</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Gradient Animation (Desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 relative overflow-hidden"
      >
        <SpaceAnimation />
      </motion.div>
    </div>
  );
}