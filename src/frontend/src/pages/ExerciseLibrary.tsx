import ExerciseLibrary from '../components/ExerciseLibrary';
import { Library } from 'lucide-react';

export default function ExerciseLibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-secondary p-4 rounded-xl shadow-lg">
            <Library className="h-10 w-10 text-background" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground">EXERCISE LIBRARY</h1>
            <p className="text-muted-foreground font-semibold">Browse exercises by muscle group</p>
          </div>
        </div>
        <ExerciseLibrary />
      </div>
    </div>
  );
}
