import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WorkoutEntry, Exercise, WorkoutHistory, ProgressStats, WorkoutPlan } from '../backend';

export function useGetWorkoutHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkoutHistory>({
    queryKey: ['workoutHistory'],
    queryFn: async () => {
      if (!actor) return { workouts: [], totalVolume: 0 };
      return actor.getWorkoutHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExerciseLibrary() {
  const { actor, isFetching } = useActor();

  return useQuery<Exercise[]>({
    queryKey: ['exerciseLibrary'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExerciseLibrary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProgressStats() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressStats>({
    queryKey: ['progressStats'],
    queryFn: async () => {
      if (!actor) return { totalWorkouts: BigInt(0), totalPlans: BigInt(0), totalVolume: 0 };
      return actor.getProgressStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkoutPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkoutPlan[]>({
    queryKey: ['workoutPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogWorkout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: WorkoutEntry[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logWorkout(entries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutHistory'] });
      queryClient.invalidateQueries({ queryKey: ['progressStats'] });
    },
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, muscleGroup, category }: { name: string; muscleGroup: string; category: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExercise(name, muscleGroup, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exerciseLibrary'] });
    },
  });
}

export function useCreateWorkoutPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, days, dailyWorkouts }: { name: string; days: bigint; dailyWorkouts: WorkoutEntry[][] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createWorkoutPlan(name, days, dailyWorkouts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlans'] });
      queryClient.invalidateQueries({ queryKey: ['progressStats'] });
    },
  });
}
