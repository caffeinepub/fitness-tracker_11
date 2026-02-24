import { useGetProgressStats } from '../hooks/useQueries';
import { TrendingUp, Dumbbell, Target, Zap, ClipboardList } from 'lucide-react';

export default function ProgressDashboard() {
  const { data: stats, isLoading } = useGetProgressStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-8 rounded-2xl shadow-lg animate-pulse">
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Workouts',
      value: stats?.totalWorkouts.toString() || '0',
      icon: Dumbbell,
      gradient: 'from-primary to-accent',
      iconBg: 'bg-primary',
    },
    {
      label: 'Workout Plans',
      value: stats?.totalPlans.toString() || '0',
      icon: ClipboardList,
      gradient: 'from-secondary to-accent',
      iconBg: 'bg-secondary',
    },
    {
      label: 'Total Volume (lbs)',
      value: stats?.totalVolume.toFixed(0) || '0',
      icon: TrendingUp,
      gradient: 'from-accent to-primary',
      iconBg: 'bg-accent',
    },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <img
          src="/assets/generated/icon-progress.dim_128x128.png"
          alt="Progress"
          className="h-12 w-12"
        />
        <h2 className="text-3xl font-black text-foreground">YOUR PROGRESS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} bg-background p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8 text-primary" strokeWidth={3} />
                </div>
                <Zap className="h-6 w-6 text-background/50" strokeWidth={3} />
              </div>
              <p className="text-background/80 font-bold text-sm uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="text-5xl font-black text-background">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
