import { useState } from 'react';
import { useGetExerciseLibrary, useAddExercise } from '../hooks/useQueries';
import { Plus, Search, Home } from 'lucide-react';
import { toast } from 'sonner';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Home Workout'];

const muscleGroupIcons: Record<string, string> = {
  Chest: '/assets/generated/icon-strength.dim_128x128.png',
  Back: '/assets/generated/icon-strength.dim_128x128.png',
  Legs: '/assets/generated/icon-strength.dim_128x128.png',
  Shoulders: '/assets/generated/icon-strength.dim_128x128.png',
  Arms: '/assets/generated/icon-flexibility.dim_128x128.png',
  Core: '/assets/generated/icon-cardio.dim_128x128.png',
  'Home Workout': '/assets/generated/home-workout-icon.dim_64x64.png',
};

const defaultExercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', category: 'Gym' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', category: 'Gym' },
  { name: 'Cable Flyes', muscleGroup: 'Chest', category: 'Gym' },
  { name: 'Push-ups', muscleGroup: 'Chest', category: 'Bodyweight' },
  // Back
  { name: 'Deadlift', muscleGroup: 'Back', category: 'Gym' },
  { name: 'Pull-ups', muscleGroup: 'Back', category: 'Bodyweight' },
  { name: 'Barbell Rows', muscleGroup: 'Back', category: 'Gym' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Gym' },
  // Legs
  { name: 'Squats', muscleGroup: 'Legs', category: 'Gym' },
  { name: 'Leg Press', muscleGroup: 'Legs', category: 'Gym' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', category: 'Gym' },
  { name: 'Leg Curls', muscleGroup: 'Legs', category: 'Gym' },
  { name: 'Calf Raises', muscleGroup: 'Legs', category: 'Gym' },
  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'Gym' },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders', category: 'Gym' },
  { name: 'Front Raises', muscleGroup: 'Shoulders', category: 'Gym' },
  { name: 'Face Pulls', muscleGroup: 'Shoulders', category: 'Gym' },
  // Arms
  { name: 'Bicep Curls', muscleGroup: 'Arms', category: 'Gym' },
  { name: 'Tricep Dips', muscleGroup: 'Arms', category: 'Bodyweight' },
  { name: 'Hammer Curls', muscleGroup: 'Arms', category: 'Gym' },
  { name: 'Skull Crushers', muscleGroup: 'Arms', category: 'Gym' },
  // Core
  { name: 'Planks', muscleGroup: 'Core', category: 'Bodyweight' },
  { name: 'Russian Twists', muscleGroup: 'Core', category: 'Bodyweight' },
  { name: 'Hanging Leg Raises', muscleGroup: 'Core', category: 'Bodyweight' },
  { name: 'Cable Crunches', muscleGroup: 'Core', category: 'Gym' },
  // Home Workout
  { name: 'Bodyweight Squats', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Lunges', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Burpees', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Mountain Climbers', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Jumping Jacks', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Sit-ups', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Leg Raises', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Superman Hold', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'Wall Sits', muscleGroup: 'Home Workout', category: 'Bodyweight' },
  { name: 'High Knees', muscleGroup: 'Home Workout', category: 'Bodyweight' },
];

export default function ExerciseLibrary() {
  const { data: exercises = [], isLoading } = useGetExerciseLibrary();
  const addExerciseMutation = useAddExercise();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: 'Chest', category: 'Gym' });

  const allExercises = exercises.length > 0 ? exercises : defaultExercises;

  const filteredExercises = allExercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || exercise.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groupedExercises = muscleGroups.reduce(
    (acc, group) => {
      acc[group] = filteredExercises.filter((ex) => ex.muscleGroup === group);
      return acc;
    },
    {} as Record<string, typeof allExercises>
  );

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExerciseMutation.mutateAsync(newExercise);
      toast.success('Exercise added successfully! 💪');
      setNewExercise({ name: '', muscleGroup: 'Chest', category: 'Gym' });
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add exercise');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-lg animate-pulse">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-card p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg font-black hover:scale-105 transition-transform whitespace-nowrap text-lg"
          >
            <Plus className="h-5 w-5" strokeWidth={3} />
            ADD EXERCISE
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddExercise} className="mt-4 p-4 bg-muted/30 rounded-xl space-y-3">
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              placeholder="Exercise name"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary outline-none text-lg"
              required
            />
            <select
              value={newExercise.muscleGroup}
              onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary outline-none text-lg"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <select
              value={newExercise.category}
              onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary outline-none text-lg"
            >
              <option value="Gym">Gym</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Home">Home</option>
            </select>
            <button
              type="submit"
              disabled={addExerciseMutation.isPending}
              className="w-full bg-primary text-background py-3 rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 text-lg"
            >
              {addExerciseMutation.isPending ? 'Adding...' : 'Add Exercise'}
            </button>
          </form>
        )}
      </div>

      {/* Muscle Group Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-5 py-3 rounded-lg font-bold transition-all text-lg ${
            !selectedGroup
              ? 'bg-primary text-background shadow-lg scale-105'
              : 'bg-card text-foreground hover:bg-muted'
          }`}
        >
          All
        </button>
        {muscleGroups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group === selectedGroup ? null : group)}
            className={`px-5 py-3 rounded-lg font-bold transition-all text-lg ${
              selectedGroup === group
                ? 'bg-primary text-background shadow-lg scale-105'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {muscleGroups.map((group) => {
          const groupExercises = groupedExercises[group];
          if (groupExercises.length === 0) return null;

          return (
            <div key={group} className="bg-card p-6 rounded-2xl shadow-lg border-2 border-border hover:border-primary transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={muscleGroupIcons[group]}
                  alt={group}
                  className="h-12 w-12"
                />
                <h3 className="text-2xl font-black text-foreground">{group}</h3>
              </div>
              <ul className="space-y-2">
                {groupExercises.map((exercise, index) => (
                  <li
                    key={index}
                    className="bg-muted/30 px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-primary/10 transition-colors text-lg"
                  >
                    {exercise.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="bg-card p-12 rounded-2xl shadow-lg text-center">
          <p className="text-xl font-bold text-muted-foreground">No exercises found</p>
        </div>
      )}
    </div>
  );
}
