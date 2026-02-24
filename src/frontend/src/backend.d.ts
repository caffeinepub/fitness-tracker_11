import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkoutHistory {
    workouts: Array<Workout>;
    totalVolume: number;
}
export interface WorkoutPlan {
    days: bigint;
    name: string;
    dailyWorkouts: Array<Array<WorkoutEntry>>;
}
export interface Exercise {
    name: string;
    category: string;
    muscleGroup: string;
}
export interface Workout {
    entries: Array<WorkoutEntry>;
    timestamp: bigint;
}
export interface WorkoutEntry {
    sets: Array<Set_>;
    exercise: Exercise;
}
export interface ProgressStats {
    totalVolume: number;
    totalWorkouts: bigint;
    totalPlans: bigint;
}
export interface Set_ {
    weight: number;
    reps: bigint;
}
export interface backendInterface {
    addExercise(name: string, muscleGroup: string, category: string): Promise<void>;
    createWorkoutPlan(name: string, days: bigint, dailyWorkouts: Array<Array<WorkoutEntry>>): Promise<void>;
    getExerciseLibrary(): Promise<Array<Exercise>>;
    getProgressStats(): Promise<ProgressStats>;
    getWorkoutHistory(): Promise<WorkoutHistory>;
    getWorkoutPlans(): Promise<Array<WorkoutPlan>>;
    logWorkout(entries: Array<WorkoutEntry>): Promise<void>;
}
