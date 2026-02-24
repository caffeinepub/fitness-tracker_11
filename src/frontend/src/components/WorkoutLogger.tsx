import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { useLogWorkout, useGetExerciseLibrary } from '../hooks/useQueries';
import type { WorkoutEntry, Set_ } from '../backend';
import { toast } from 'sonner';

interface ExerciseForm {
  exerciseName: string;
  muscleGroup: string;
  category: string;
  sets: SetForm[];
}

interface SetForm {
  reps: string;
  weight: string;
}

export default function WorkoutLogger() {
  const navigate = useNavigate();
  const { data: exerciseLibrary = [] } = useGetExerciseLibrary();
  const logWorkoutMutation = useLogWorkout();
  const [exercises, setExercises] = useState<ExerciseForm[]>([
    { exerciseName: '', muscleGroup: '', category: 'Gym', sets: [{ reps: '', weight: '' }] },
  ]);

  const addExercise = () => {
    setExercises([...exercises, { exerciseName: '', muscleGroup: '', category: 'Gym', sets: [{ reps: '', weight: '' }] }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof ExerciseForm, value: string) => {
    const updated = [...exercises];
    if (field === 'exerciseName') {
      updated[index].exerciseName = value;
      const exercise = exerciseLibrary.find((e) => e.name === value);
      if (exercise) {
        updated[index].muscleGroup = exercise.muscleGroup;
        updated[index].category = exercise.category;
      }
    } else {
      updated[index][field] = value as any;
    }
    setExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof SetForm, value: string) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entries: WorkoutEntry[] = exercises
      .filter((ex) => ex.exerciseName && ex.sets.some((s) => s.reps && s.weight))
      .map((ex) => ({
        exercise: {
          name: ex.exerciseName,
          muscleGroup: ex.muscleGroup || 'Other',
          category: ex.category || 'Gym',
        },
        sets: ex.sets
          .filter((s) => s.reps && s.weight)
          .map((s) => ({
            reps: BigInt(parseInt(s.reps) || 0),
            weight: parseFloat(s.weight) || 0,
          })) as Set_[],
      }));

    if (entries.length === 0) {
      toast.error('Please add at least one exercise with sets');
      return;
    }

    try {
      await logWorkoutMutation.mutateAsync(entries);
      toast.success('Workout logged successfully! 💪');
      navigate({ to: '/history' });
    } catch (error) {
      toast.error('Failed to log workout');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="bg-card p-6 rounded-2xl shadow-lg border-2 border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-foreground">Exercise {exerciseIndex + 1}</h3>
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(exerciseIndex)}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                Exercise Name
              </label>
              <input
                type="text"
                list={`exercises-${exerciseIndex}`}
                value={exercise.exerciseName}
                onChange={(e) => updateExercise(exerciseIndex, 'exerciseName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g., Bench Press"
                required
              />
              <datalist id={`exercises-${exerciseIndex}`}>
                {exerciseLibrary.map((ex) => (
                  <option key={ex.name} value={ex.name} />
                ))}
              </datalist>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-foreground uppercase tracking-wide">Sets</label>
                <button
                  type="button"
                  onClick={() => addSet(exerciseIndex)}
                  className="flex items-center gap-2 px-3 py-1 bg-primary text-background rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Add Set
                </button>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex gap-3 items-center">
                  <span className="text-sm font-black text-muted-foreground w-12">#{setIndex + 1}</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Reps"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Weight (lbs)"
                      min="0"
                      required
                    />
                  </div>
                  {exercise.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExercise}
        className="w-full py-4 border-2 border-dashed border-primary text-primary rounded-2xl font-black hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-6 w-6" strokeWidth={3} />
        ADD ANOTHER EXERCISE
      </button>

      <button
        type="submit"
        disabled={logWorkoutMutation.isPending}
        className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-background py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {logWorkoutMutation.isPending ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-background"></div>
            SAVING...
          </>
        ) : (
          <>
            <CheckCircle className="h-6 w-6" strokeWidth={3} />
            COMPLETE WORKOUT
          </>
        )}
      </button>
    </form>
  );
}
