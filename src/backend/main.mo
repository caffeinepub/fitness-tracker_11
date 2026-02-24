import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
    fitnessGoal : ?Text;
  };

  type Exercise = {
    name : Text;
    muscleGroup : Text;
    category : Text;
  };

  module Exercise {
    public func compare(ex1 : Exercise, ex2 : Exercise) : Order.Order {
      Text.compare(ex1.name, ex2.name);
    };
  };

  type Set = {
    reps : Nat;
    weight : Float;
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

  type UserData = {
    exercises : List.List<Exercise>;
    workouts : List.List<Workout>;
    plans : List.List<WorkoutPlan>;
    var totalVolume : Float;
  };

  let users = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Exercise Library Management
  public shared ({ caller }) func addExercise(
    name : Text,
    muscleGroup : Text,
    category : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add exercises");
    };
    let user = getUserData(caller);
    let exercise : Exercise = {
      name;
      muscleGroup;
      category;
    };
    user.exercises.add(exercise);
  };

  public query ({ caller }) func getExerciseLibrary() : async [Exercise] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access exercise library");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.exercises.toArray().sort() };
    };
  };

  // Workout Logging
  public shared ({ caller }) func logWorkout(entries : [WorkoutEntry]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log workouts");
    };
    let user = getUserData(caller);
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

    user.workouts.add(workout);
    user.totalVolume += workoutVolume;
  };

  public query ({ caller }) func getWorkoutHistory() : async ?WorkoutHistory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve workout history");
    };
    let user = users.get(caller);
    switch (user) {
      case (null) { null };
      case (?userData) {
        ?{
          workouts = userData.workouts.toArray();
          totalVolume = userData.totalVolume;
        };
      };
    };
  };

  // Workout Plans
  public shared ({ caller }) func createWorkoutPlan(
    name : Text,
    days : Nat,
    dailyWorkouts : [[WorkoutEntry]],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create workout plans");
    };
    let user = getUserData(caller);
    let plan : WorkoutPlan = {
      name;
      days;
      dailyWorkouts;
    };
    user.plans.add(plan);
  };

  public query ({ caller }) func getWorkoutPlans() : async [WorkoutPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve workout plans");
    };
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.plans.toArray() };
    };
  };

  // Progress Statistics
  public query ({ caller }) func getProgressStats() : async ?ProgressStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access progress stats");
    };
    let user = users.get(caller);
    switch (user) {
      case (null) { null };
      case (?userData) {
        let totalWorkouts = userData.workouts.size();
        let totalPlans = userData.plans.size();
        ?{
          totalWorkouts;
          totalPlans;
          totalVolume = userData.totalVolume;
        };
      };
    };
  };

  // Helper Functions
  func getUserData(principal : Principal) : UserData {
    switch (users.get(principal)) {
      case (null) {
        let newUser = {
          exercises = List.fromArray<Exercise>([]);
          workouts = List.fromArray<Workout>([]);
          plans = List.fromArray<WorkoutPlan>([]);
          var totalVolume = 0.0;
        };
        users.add(principal, newUser);
        newUser;
      };
      case (?user) { user };
    };
  };
};
