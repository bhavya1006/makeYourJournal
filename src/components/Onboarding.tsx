import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { SpaceAnimation } from './SpaceAnimation';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const canSubmit = acceptedTerms && acceptedPrivacy;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Background Animation for Mobile - Blurred */}
      <div className="lg:hidden absolute inset-0">
        <SpaceAnimation />
        <div className="absolute inset-0 backdrop-blur-md bg-white/80" />
      </div>

      {/* Left Side - Terms & Privacy */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white relative z-10"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="size-10 sm:size-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <Shield className="size-5 sm:size-6 text-primary" />
              </div>
              <div>
                <h1 className="mb-1 text-2xl sm:text-3xl">Before we begin</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Please review our terms and privacy policy</p>
              </div>
            </div>

            {/* Terms of Service */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-muted/30 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4"
            >
              <h3 className="text-lg sm:text-xl">Terms of Service</h3>
              <div className="space-y-2 sm:space-y-3 text-muted-foreground max-h-32 sm:max-h-40 overflow-y-auto pr-2 scrollbar-thin text-sm sm:text-base">
                <p>
                  Welcome to our task tracking platform. By using this service, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 ml-2">
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You will not use the service for any illegal or unauthorized purpose</li>
                  <li>We reserve the right to modify or terminate the service at any time</li>
                  <li>Your use of the service is at your own risk</li>
                  <li>We are not liable for any damages arising from the use of this service</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border/50">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="size-4 sm:size-5 rounded-md"
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer select-none text-sm sm:text-base"
                >
                  I have read and agree to the Terms of Service
                </label>
              </div>
            </motion.div>

            {/* Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-muted/30 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4"
            >
              <h3 className="text-lg sm:text-xl">Privacy Policy</h3>
              <div className="space-y-2 sm:space-y-3 text-muted-foreground max-h-32 sm:max-h-40 overflow-y-auto pr-2 scrollbar-thin text-sm sm:text-base">
                <p>
                  We take your privacy seriously. Here's how we handle your data:
                </p>
                <ul className="list-disc list-inside space-y-1 sm:space-y-2 ml-2">
                  <li>We collect only necessary information to provide our services</li>
                  <li>Your data is stored securely and encrypted</li>
                  <li>We will never sell your personal information to third parties</li>
                  <li>You can request deletion of your data at any time</li>
                  <li>We use cookies to enhance your experience</li>
                  <li>Analytics are collected to improve our service</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border/50">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                  className="size-4 sm:size-5 rounded-md"
                />
                <label
                  htmlFor="privacy"
                  className="cursor-pointer select-none text-sm sm:text-base"
                >
                  I have read and agree to the Privacy Policy
                </label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                onClick={onComplete}
                disabled={!canSubmit}
                className="w-full h-10 sm:h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
              >
                <span>Continue to Dashboard</span>
                <Check className="ml-2 size-3.5 sm:size-4 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
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