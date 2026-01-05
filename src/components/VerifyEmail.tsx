export function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-muted-foreground">
          We’ve sent a verification link to your email.
        </p>
        <p className="text-sm text-muted-foreground">
          After verification, you’ll be redirected automatically.
        </p>
      </div>
    </div>
  )
}
