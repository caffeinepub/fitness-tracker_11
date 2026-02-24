import WorkoutLogger from '../components/WorkoutLogger';
import { Dumbbell } from 'lucide-react';

export default function LogWorkout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary p-4 rounded-xl shadow-lg">
            <Dumbbell className="h-10 w-10 text-background" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground">LOG YOUR WORKOUT</h1>
            <p className="text-muted-foreground font-semibold">Track your exercises and crush your goals</p>
          </div>
        </div>
        <WorkoutLogger />
      </div>
    </div>
  );
}
