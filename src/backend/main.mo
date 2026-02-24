import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Exercise = {
    name : Text;
    muscleGroup : Text;
    category : Text; // Differentiates gym, home bodyweight, etc.
  };

  module Exercise {
    public func compare(ex1 : Exercise, ex2 : Exercise) : Order.Order {
      Text.compare(ex1.name, ex2.name);
    };
  };

  type Set = {
    reps : Nat;
    weight : Float; // 0 for bodyweight exercises
  };

  type WorkoutEntry = {
    exercise : Exercise;
    sets : [Set];
  };

  type Workout = {
    timestamp : Int;
    entries : [WorkoutEntry];
  };

  type WorkoutPlan = {
    name : Text;
    days : Nat;
    dailyWorkouts : [[WorkoutEntry]];
  };

  type WorkoutHistory = {
    workouts : [Workout];
    totalVolume : Float;
  };

  type ProgressStats = {
    totalWorkouts : Nat;
    totalPlans : Nat;
    totalVolume : Float;
  };

  let exercises = List.fromArray<Exercise>([]);
  let workouts = List.fromArray<Workout>([]);
  let plans = List.fromArray<WorkoutPlan>([]);
  var totalVolume = 0.0;

  public shared ({ caller }) func addExercise(
    name : Text,
    muscleGroup : Text,
    category : Text,
  ) : async () {
    let exercise : Exercise = {
      name;
      muscleGroup;
      category;
    };
    exercises.add(exercise);
  };

  public shared ({ caller }) func logWorkout(entries : [WorkoutEntry]) : async () {
    let workout : Workout = {
      timestamp = Time.now();
      entries;
    };

    var workoutVolume = 0.0;
    for (entry in entries.values()) {
      for (set in entry.sets.values()) {
        workoutVolume += set.reps.toFloat() * set.weight;
      };
    };

    workouts.add(workout);
    totalVolume += workoutVolume;
  };

  public shared ({ caller }) func createWorkoutPlan(
    name : Text,
    days : Nat,
    dailyWorkouts : [[WorkoutEntry]],
  ) : async () {
    let plan : WorkoutPlan = {
      name;
      days;
      dailyWorkouts;
    };
    plans.add(plan);
  };

  public query ({ caller }) func getWorkoutHistory() : async WorkoutHistory {
    {
      workouts = workouts.toArray();
      totalVolume;
    };
  };

  public query ({ caller }) func getWorkoutPlans() : async [WorkoutPlan] {
    plans.toArray();
  };

  public query ({ caller }) func getExerciseLibrary() : async [Exercise] {
    exercises.toArray().sort();
  };

  public query ({ caller }) func getProgressStats() : async ProgressStats {
    let totalWorkouts = workouts.size();
    let totalPlans = plans.size();
    {
      totalWorkouts;
      totalPlans;
      totalVolume;
    };
  };
};
