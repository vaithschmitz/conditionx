// src/lib/fieldSchema.js

const injuryOptions = [ 'Head', 'Neck', 'Back', 'Chest', 'Core', 'Hip',
    'Right Shoulder', 'Right Lat', 'Right Upper Arm', 'Right Elbow', 'Right Forearm', 'Right Wrist',
    'Right Fingers', 'Right Upper Leg', 'Right Knee', 'Right Lower Leg', 'Right Ankle', 'Right Foot', 'Right Toes',
    'Left Shoulder', 'Left Lat', 'Left Upper Arm', 'Left Elbow', 'Left Forearm', 'Left Wrist',
    'Left Fingers', 'Left Upper Leg', 'Left Knee', 'Left Lower Leg', 'Left Foot', 'Left Toes',
    'Other'
  ];
  
  const activityOptions = ['Climbing', 'Conditioning', 'Cardio', 'Yoga', 'Recovery', 'Hangboarding', 'Rest Day'];
  
  const timeOfDayOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  const climbTypeOptions = ['Sport','Trad','Bouldering','Free Solo','Other'];
  const climbLocationTypeOptions = ['Gym','Outdoor','Urban','Other'];
  const holdTypeOptions = ['Crack','Crimp','Edge', 'Mono','Jug','Sloper','Pinch','Pocket','Other'];
  const wallAngleOptions = ['Slab','Vertical','Overhang','Roof','Other'];
  const problemTypeOptions = ['Balancy','Compy','Easy','Endurance','Technical','Power','Pumpy','Other'];
  const sessionTypeOptions = ['Comp','Project','Send','Warm-up','Social','Volume','Unstructured','Other'];
  const ascentMethodOptions = ['Top Rope','Lead','Solo','Other'];
  
  const sportTradGrades = (() => {
    const base = ['5a','5b','5c','6a','6b','6c','7a','7b','7c','8a','8b','8c','9a','9b','9c'];
    return base.flatMap(g => [g, g+'+']);
  })();
  const boulderGrades = Array.from({ length:18 }, (_, i) => `V${i}`);
  
  const conditioningMuscleOptions = ['Abdominals','Back','Biceps','Calves','Chest','Forearms','Glutes','Hamstrings','Quadriceps','Shoulders','Triceps'];
  
  const yogaTypeOptions = ['Hatha','Vinyasa','Ashtanga','Yin','Restorative','Other'];
  const yogaPropsOptions = ['Block','Strap','Bolster','Blanket','Wheel','Other'];
  
  const recoveryTypeOptions = [
    'Cold Shower', 'Compression', 'Contrast Bath', 'Cryotherapy',
    'Foam Rolling', 'Ice Bath', 'Massage', 'Sauna', 'Steam Room',
    'Tens', 'Theragun', 'Other'
  ];
  
  const cardioTypes = ['Cycling', 'Running', 'Swimming', 'Other'];
  const cyclingTypes = ['Road','Mountain','Indoor','Other'];
  const runningTypes = ['Trail','Road','Treadmill','Other'];
  const swimmingTypes = ['Pool','Open Water','Other'];
  
  export const fieldSchema = {
    // General
    date:              { label: 'Date', type: 'date'},
    time_of_day:       { label: 'Time of Day', type: 'select', options: timeOfDayOptions },
    activity_type:     { label: 'Activity', type: 'select', options: activityOptions },
    current_injuries:  { label: 'Current Injuries', type: 'array', multiline: true, options: injuryOptions },
  
    fatigue:           { label: 'Fatigue', type: 'select', options: Array.from({ length: 10 }, (_, i) => i + 1) },
    mental:            { label: 'Mental', type: 'select', options: Array.from({ length: 10 }, (_, i) => i + 1) },
    rpe:               { label: 'RPE', type: 'select', options: Array.from({ length: 10 }, (_, i) => i + 1) },
    duration:          { label: 'Duration (min)', type: 'number' },
    location:          { label: 'Location', type: 'text' },
    injury_modifications: { label: 'Injury Mods', type: 'textarea', multiline: true },
    session_notes:     { label: 'Session Notes', type: 'textarea', multiline: true },
  
    // Climbing
    climb_type:        { label: 'Climb Type', type: 'select', options: climbTypeOptions, activity: 'Climbing' },
    climb_location_type: { label: 'Location Type', type: 'select', options: climbLocationTypeOptions, activity: 'Climbing' },
    climb_hardest_grade: { label: 'Hardest Grade', type: 'select', options: [...sportTradGrades, ...boulderGrades], activity: 'Climbing' },
    climb_average_grade: { label: 'Average Grade', type: 'select', options: [...sportTradGrades, ...boulderGrades], activity: 'Climbing' },
    climb_hold_types:    { label: 'Hold Types', type: 'array', options: holdTypeOptions, activity: 'Climbing' },
    climb_wall_angle:    { label: 'Wall Angle', type: 'array', options: wallAngleOptions, activity: 'Climbing' },
    climb_problem_types: { label: 'Problem Types', type: 'array', options: problemTypeOptions, activity: 'Climbing' },
    climb_session_type:  { label: 'Session Type', type: 'array', options: sessionTypeOptions, activity: 'Climbing' },
    climb_ascent_method: { label: 'Ascent Method', type: 'select', options: ascentMethodOptions, activity: 'Climbing' },
    climb_falls:         { label: 'Falls', type: 'number', activity: 'Climbing' },
    climb_mental_load:   { label: 'Mental Load', type: 'number', activity: 'Climbing' },
    climb_sends:         { label: 'Sends', type: 'number', activity: 'Climbing' },
  
    // Cardio
    cardio_type:          { label: 'Cardio Type', type: 'select', options: cardioTypes, activity: 'Cardio' },
    cardio_cycling_type:  { label: 'Cycling Type', type: 'select', options: cyclingTypes, activity: 'Cardio' },
    cardio_running_type:  { label: 'Running Type', type: 'select', options: runningTypes, activity: 'Cardio' },
    cardio_swimming_type: { label: 'Swimming Type', type: 'select', options: swimmingTypes, activity: 'Cardio' },
    cardio_distance:      { label: 'Distance', type: 'number', activity: 'Cardio' },
  
    // Conditioning
    conditioning_muscles_worked: { label: 'Muscles Worked', type: 'array', options: conditioningMuscleOptions, activity: 'Conditioning' },
  
    // Yoga
    yoga_type:         { label: 'Yoga Type', type: 'select', options: yogaTypeOptions, activity: 'Yoga' },
    yoga_breath_control: { label: 'Breath Control', type: 'number', activity: 'Yoga' },
    yoga_flexibility:    { label: 'Flexibility', type: 'number', activity: 'Yoga' },
    yoga_focus:          { label: 'Focus', type: 'number', activity: 'Yoga' },
    yoga_props_used:     { label: 'Props Used', type: 'array', options: yogaPropsOptions, activity: 'Yoga' },
  
    // Recovery
    recovery_type:    { label: 'Recovery Type', type: 'array', options: recoveryTypeOptions, activity: 'Recovery' },
  
    // Optional
    media:            { label: 'Media URL', type: 'text' },
  
    // System (excluded)
    id:               { hidden: true },
    user_id:          { hidden: true },
    created_at:       { hidden: true },
  };
  