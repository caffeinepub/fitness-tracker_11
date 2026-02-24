import WorkoutHistoryList from '../components/WorkoutHistoryList';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-accent p-4 rounded-xl shadow-lg">
            <HistoryIcon className="h-10 w-10 text-background" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground">WORKOUT HISTORY</h1>
            <p className="text-muted-foreground font-semibold">Review your progress and achievements</p>
          </div>
        </div>
        <WorkoutHistoryList />
      </div>
    </div>
  );
}
