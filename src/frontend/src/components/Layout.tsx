import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { Dumbbell, Home, Plus, History, Library, LogIn, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';

export default function Layout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/log-workout', label: 'Log Workout', icon: Plus },
    { path: '/history', label: 'History', icon: History },
    { path: '/exercises', label: 'Exercises', icon: Library },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary via-accent to-secondary border-b-4 border-accent shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-background p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Dumbbell className="h-8 w-8 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-background tracking-tight">Amit Sharma Fitness</h1>
                <p className="text-xs font-bold text-background/80 uppercase tracking-wider">Push Your Limits</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPath === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                        isActive
                          ? 'bg-background text-primary shadow-md scale-105'
                          : 'text-background hover:bg-background/20 hover:scale-105'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.5} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 bg-background/20 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4 text-background" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-background truncate max-w-[100px]">
                      {identity.getPrincipal().toString().slice(0, 8)}...
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="bg-background text-primary hover:bg-background/90 font-bold border-2 border-background shadow-md"
                  >
                    <LogOut className="h-4 w-4 mr-2" strokeWidth={2.5} />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={login}
                  disabled={isLoggingIn || isInitializing}
                  variant="outline"
                  size="sm"
                  className="bg-background text-primary hover:bg-background/90 font-bold border-2 border-background shadow-md"
                >
                  <LogIn className="h-4 w-4 mr-2" strokeWidth={2.5} />
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
          <nav className="md:hidden flex gap-1 mt-3 overflow-x-auto pb-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-background text-primary shadow-md'
                      : 'text-background hover:bg-background/20'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          {isAuthenticated && (
            <div className="md:hidden flex items-center gap-2 mt-2 bg-background/20 px-3 py-2 rounded-lg">
              <User className="h-4 w-4 text-background" strokeWidth={2.5} />
              <span className="text-xs font-bold text-background truncate">
                {identity.getPrincipal().toString().slice(0, 12)}...
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Amit Sharma Fitness. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'amit-sharma-fitness'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
