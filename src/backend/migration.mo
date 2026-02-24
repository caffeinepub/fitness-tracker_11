import List "mo:core/List";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  type OldExercise = {
    name : Text;
    muscleGroup : Text;
  };

  type OldSet = {
    reps : Nat;
    weight : Float;
  };

  type OldWorkoutEntry = {
    exercise : OldExercise;
    sets : [OldSet];
  };

  type OldWorkout = {
    timestamp : Int;
    entries : [OldWorkoutEntry];
  };

  type OldActor = {
    exercises : List.List<OldExercise>;
    workouts : List.List<OldWorkout>;
    totalVolume : Float;
  };

  type NewExercise = {
    name : Text;
    muscleGroup : Text;
    category : Text;
  };

  type NewSet = {
    reps : Nat;
    weight : Float;
  };

  type NewWorkoutEntry = {
    exercise : NewExercise;
    sets : [NewSet];
  };

  type NewWorkout = {
    timestamp : Int;
    entries : [NewWorkoutEntry];
  };

  type NewWorkoutPlan = {
    name : Text;
    days : Nat;
    dailyWorkouts : [[NewWorkoutEntry]];
  };

  type NewActor = {
    exercises : List.List<NewExercise>;
    workouts : List.List<NewWorkout>;
    plans : List.List<NewWorkoutPlan>;
    totalVolume : Float;
  };

  public func run(old : OldActor) : NewActor {
    let mappedExercises = old.exercises.map<OldExercise, NewExercise>(
      func(oldExercise) {
        {
          oldExercise with category = "Gym";
        };
      }
    );

    let mappedWorkouts = old.workouts.map<OldWorkout, NewWorkout>(
      func(oldWorkout) {
        {
          oldWorkout with entries = oldWorkout.entries.map<OldWorkoutEntry, NewWorkoutEntry>(
            func(entry) {
              {
                entry with exercise = {
                  entry.exercise with category = "Gym";
                };
              };
            }
          );
        };
      }
    );

    {
      old with
      exercises = mappedExercises;
      workouts = mappedWorkouts;
      plans = List.empty<NewWorkoutPlan>();
    };
  };
};
