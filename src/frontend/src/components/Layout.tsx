import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { Dumbbell, Home, Plus, History, Library } from 'lucide-react';

export default function Layout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

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
                <h1 className="text-3xl font-black text-background tracking-tight">FitTrack</h1>
                <p className="text-xs font-bold text-background/80 uppercase tracking-wider">Push Your Limits</p>
              </div>
            </Link>
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
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FitTrack. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'fitness-tracker'
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
