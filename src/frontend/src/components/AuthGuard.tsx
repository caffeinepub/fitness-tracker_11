import { type ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Dumbbell, LogIn, Loader2, Shield } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, isLoggingIn, isInitializing } = useInternetIdentity();

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" strokeWidth={3} />
          <p className="text-lg font-bold text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-primary via-accent to-secondary p-1 rounded-3xl shadow-2xl">
            <div className="bg-background rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-gradient-to-br from-primary to-accent p-4 rounded-2xl mb-6 shadow-lg">
                  <Dumbbell className="h-16 w-16 text-background" strokeWidth={3} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
                  Welcome to Amit Sharma Fitness
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-semibold mb-2">
                  Your personal fitness tracking companion
                </p>
                <p className="text-base text-muted-foreground">
                  Track workouts, monitor progress, and achieve your fitness goals
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" strokeWidth={2.5} />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">
                      Your workout data is completely private and secure. Each user has their own separate account with encrypted authentication.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-background rounded-xl">
                    <p className="text-2xl font-black text-primary mb-1">📊</p>
                    <p className="text-sm font-bold text-foreground">Track Progress</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-xl">
                    <p className="text-2xl font-black text-accent mb-1">💪</p>
                    <p className="text-sm font-bold text-foreground">Log Workouts</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-xl">
                    <p className="text-2xl font-black text-secondary mb-1">🎯</p>
                    <p className="text-sm font-bold text-foreground">Set Goals</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-background font-black text-lg py-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" strokeWidth={3} />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-6 w-6 mr-3" strokeWidth={3} />
                    Login to Get Started
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Login with Internet Identity - supports passkeys, Google, Apple, and Microsoft accounts
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
