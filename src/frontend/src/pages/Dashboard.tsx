import { Link } from '@tanstack/react-router';
import { Plus, History, TrendingUp, Dumbbell, Target, Zap } from 'lucide-react';
import ProgressDashboard from '../components/ProgressDashboard';

export default function Dashboard() {
  return (
    <div className="relative">
      {/* Hero Section with Background */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/generated/hero-fitness.dim_1920x1080.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-accent/70 to-background"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-black text-background mb-4 tracking-tight drop-shadow-lg">
            UNLEASH YOUR POWER
          </h1>
          <p className="text-xl md:text-2xl font-bold text-background/90 mb-8 max-w-2xl drop-shadow-md">
            Track every rep, crush every goal, become unstoppable
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/log-workout"
              className="bg-background text-primary px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus className="h-6 w-6" strokeWidth={3} />
              LOG WORKOUT
            </Link>
            <Link
              to="/history"
              className="bg-secondary text-background px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2 border-2 border-background"
            >
              <History className="h-6 w-6" strokeWidth={3} />
              VIEW HISTORY
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <ProgressDashboard />
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-foreground mb-6 flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" strokeWidth={3} />
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/log-workout"
            className="group bg-gradient-to-br from-primary to-accent p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-background p-4 rounded-xl group-hover:scale-110 transition-transform">
                <Dumbbell className="h-8 w-8 text-primary" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-background">Start Workout</h3>
            </div>
            <p className="text-background/90 font-semibold">Log your exercises, sets, and reps</p>
          </Link>

          <Link
            to="/exercises"
            className="group bg-gradient-to-br from-secondary to-accent p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-background p-4 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-secondary" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-background">Browse Exercises</h3>
            </div>
            <p className="text-background/90 font-semibold">Explore exercises by muscle group</p>
          </Link>

          <Link
            to="/history"
            className="group bg-gradient-to-br from-accent to-primary p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-background p-4 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-accent" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-background">Track Progress</h3>
            </div>
            <p className="text-background/90 font-semibold">Review your workout history</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
