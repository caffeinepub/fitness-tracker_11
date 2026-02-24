import { useGetWorkoutHistory } from '../hooks/useQueries';
import { Calendar, Dumbbell, TrendingUp } from 'lucide-react';

export default function WorkoutHistoryList() {
  const { data: history, isLoading } = useGetWorkoutHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-lg animate-pulse">
            <div className="h-6 bg-muted rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!history || history.workouts.length === 0) {
    return (
      <div className="bg-card p-12 rounded-2xl shadow-lg text-center">
        <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" strokeWidth={2} />
        <h3 className="text-2xl font-black text-foreground mb-2">No Workouts Yet</h3>
        <p className="text-muted-foreground font-semibold mb-6">
          Start your fitness journey by logging your first workout!
        </p>
        <a
          href="/log-workout"
          className="inline-flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-black hover:scale-105 transition-transform"
        >
          <Dumbbell className="h-5 w-5" strokeWidth={3} />
          LOG FIRST WORKOUT
        </a>
      </div>
    );
  }

  const sortedWorkouts = [...history.workouts].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 text-background">
          <TrendingUp className="h-8 w-8" strokeWidth={3} />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-90">Total Volume Lifted</p>
            <p className="text-4xl font-black">{history.totalVolume.toFixed(0)} lbs</p>
          </div>
        </div>
      </div>

      {sortedWorkouts.map((workout, index) => {
        const date = new Date(Number(workout.timestamp) / 1000000);
        const workoutVolume = workout.entries.reduce((total, entry) => {
          return (
            total +
            entry.sets.reduce((setTotal, set) => {
              return setTotal + Number(set.reps) * set.weight;
            }, 0)
          );
        }, 0);

        return (
          <div key={index} className="bg-card p-6 rounded-2xl shadow-lg border-2 border-border hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Calendar className="h-6 w-6 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Volume</p>
                <p className="text-2xl font-black text-primary">{workoutVolume.toFixed(0)} lbs</p>
              </div>
            </div>

            <div className="space-y-3">
              {workout.entries.map((entry, entryIndex) => (
                <div key={entryIndex} className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-foreground">{entry.exercise.name}</h4>
                    <span className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 bg-background rounded">
                      {entry.exercise.muscleGroup}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className="bg-background px-3 py-1 rounded-lg text-sm font-bold text-foreground"
                      >
                        {Number(set.reps)} × {set.weight} lbs
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
