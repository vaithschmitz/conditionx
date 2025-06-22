import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const injuryOptions = [  'Head', 'Neck', 'Back', 'Chest', 'Core', 'Hip',
    'Right Shoulder', 'Right Lat', 'Right Upper Arm', 'Right Elbow', 'Right Forearm', 'Right Wrist',
    'Right Fingers', 'Right Upper Leg', 'Right Knee', 'Right Lower Leg', 'Right Ankle', 'Right Foot', 'Right Toes',
    'Left Shoulder', 'Left Lat', 'Left Upper Arm', 'Left Elbow', 'Left Forearm', 'Left Wrist',
    'Left Fingers', 'Left Upper Leg', 'Left Knee', 'Left Lower Leg', 'Left Foot', 'Left Toes',
    'Other'];
const activityOptions = [
  { value:'', label:'Select Activity' },
  { value:'Climbing', label:'Climbing' },
  { value:'Conditioning', label:'Conditioning' },
  { value:'Cardio', label:'Cardio' },
  { value:'Yoga', label:'Yoga' },
  { value:'Recovery', label:'Recovery' },
  { value:'Hangboarding', label:'Hangboarding' },
  { value:'Rest Day', label:'Rest Day' },
];
const timeOfDayOptions = [
  { value:'', label:'Time of Day' },
  { value:'Morning', label:'Morning' },
  { value:'Afternoon', label:'Afternoon' },
  { value:'Evening', label:'Evening' },
  { value:'Night', label:'Night' },
];
const climbTypeOptions = ['Sport','Trad','Bouldering','Free Solo'];
const climbLocationTypeOptions = ['Gym','Outdoor','Urban'];
const holdTypeOptions = ['Crack','Crimp','Edge', 'Mono','Jug','Sloper','Pinch','Pocket'];
const wallAngleOptions = ['Slab','Vertical','Overhang','Roof'];
const problemTypeOptions = ['Balancy','Compy','Easy','Endurance','Technical','Power','Pumpy','Other'];
const sessionTypeOptions = ['Comp','Project','Send','Warm-up','Social','Volume','Unstructured'];
const ascentMethodOptions = ['Top Rope','Lead','Solo'];
const sportTradGrades = (() => {
  const base = ['5a','5b','5c','6a','6b','6c','7a','7b','7c','8a','8b','8c','9a','9b','9c'];
  return base.flatMap(g => [g, g+'+']);
})();
const boulderGrades = Array.from({ length:18 }, (_, i) => `V${i}`);
const conditioningMuscleOptions = ['Abdominals','Back','Biceps','Calves','Chest','Forearms','Glutes','Hamstrings','Quadriceps','Shoulders','Triceps'];
const yogaTypeOptions = ['Hatha','Vinyasa','Ashtanga','Yin','Restorative'];
const yogaPropsOptions = ['Block','Strap','Bolster','Blanket','Wheel'];
const recoveryTypeOptions = [  'Cold Shower',
    'Compression',
    'Contrast Bath',
    'Cryotherapy',
    'Foam Rolling',
    'Ice Bath',
    'Massage',
    'Sauna',
    'Steam Room',
    'Tens',
    'Theragun',
    'Other'];
const cardioTypes = [
  { value:'', label:'Select Cardio Type' },
  { value:'Cycling', label:'Cycling' },
  { value:'Running', label:'Running' },
  { value:'Swimming', label:'Swimming' },
  { value:'Other', label:'Other' },
];
const cyclingTypes = ['Road','Mountain','Indoor'];
const runningTypes = ['Trail','Road','Treadmill'];
const swimmingTypes = ['Pool','Open Water'];

// Helper: build dropdown 1–10
const scaleOptions = Array.from({ length: 10 }, (_, i) => ({ value:`${i+1}`, label:`${i+1}` }));

export default function LogActivity() {
  const { session } = useAuth();

  const [formData, setFormData] = useState({
    date: '',
    time_of_day: '',
    fatigue: '',          
    mental: '',
    current_injuries: [],
  
    activity_type: '',
    climb_type: '',
    climb_location_type: '',
    climb_hardest_grade: '',
    climb_average_grade: '',
    climb_hold_types: [],
    climb_sends: '',       
    climb_wall_angle: [],
    climb_problem_types: [],
    climb_session_type: [],
    climb_ascent_method: '',
    climb_falls: '',        
    climb_mental_load: '',  
  
    conditioning_muscles_worked: [],
    yoga_type: '',
    yoga_breath_control: '',
    yoga_flexibility: '',
    yoga_focus: '',
    yoga_props_used: [],
  
    recovery_type: [],
  
    cardio_type: '',
    cardio_cycling_type: '',
    cardio_running_type: '',
    cardio_swimming_type: '',
    cardio_distance: '',
  
    session_notes: '',
    rpe: '',
    duration: '',
    injury_modifications: '',
    media: '',
    location: ''
  });
  
  console.log(formData)

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMulti = (name, selected) => {
    setFormData(prev => ({ ...prev, [name]: selected }));
  };

  const isIntroComplete = () =>
    formData.date && formData.time_of_day && formData.activity_type;

  const validateClimbing = () => {
    const {
      climb_type, climb_location_type, climb_hardest_grade, climb_average_grade,
      climb_hold_types, climb_wall_angle, climb_problem_types, climb_session_type
    } = formData;
    if (!climb_type||!climb_location_type||!climb_hardest_grade||!climb_average_grade) return false;
    if (!climb_hold_types.length||!climb_wall_angle.length||!climb_problem_types.length||!climb_session_type.length) return false;
    if ((climb_type==='Trad'||climb_type==='Free Solo') && !formData.climb_mental_load) return false;
    return true;
  };
  const validateConditioning = () => formData.conditioning_muscles_worked.length>0;
  const validateYoga = () => formData.yoga_type;
  const validateRecovery = () => formData.recovery_type.length>0;
  const validateCardio = () => {
    const ct = formData.cardio_type;
    if (!ct) return false;
    if (ct==='Cycling' && !formData.cardio_cycling_type) return false;
    if (ct==='Running' && !formData.cardio_running_type) return false;
    if (ct==='Swimming' && !formData.cardio_swimming_type) return false;
    if (ct!=='Other' && (!formData.cardio_distance||formData.cardio_distance<=0)) return false;
    return true;
  };

  const isDrilldownComplete = () => {
    if (!isIntroComplete()) return false;
    switch (formData.activity_type) {
        case 'Climbing': return validateClimbing();
        case 'Conditioning': return validateConditioning();
        case 'Yoga': return validateYoga();
        case 'Recovery': return validateRecovery();
        case 'Cardio': return validateCardio();
        case 'Hangboarding':
        case 'Rest Day': return true;
        default: return false;
      }      
  };

  const isGeneralComplete = () =>
    formData.rpe && formData.duration;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isIntroComplete()) return alert('Fill intro.');
    if (!isDrilldownComplete()) return alert('Fill activity details.');
    if (formData.activity_type !== 'Rest Day' && !isGeneralComplete())
        return alert('Fill general info.');
  
    // Clean empty strings and empty arrays to null
    const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => {
          if (val === '') return [key, null];
          if (Array.isArray(val) && val.length === 0) return [key, null];
          return [key, val];
        })
      );
      
      
  
    const { error } = await supabase.from('workouts').insert([
      { user_id: session.user.id, ...cleanData }
    ]);
  
    if (error) {
      console.error('Insert error:', error);
      alert('Failed to submit log.');
    } else {
      alert('Logged!');
      setFormData(prev => ({
        ...prev,
        date: '', time_of_day: '', fatigue: '', mental: '', current_injuries: [],
        activity_type: '', climb_type: '', climb_location_type: '', climb_hardest_grade: '', climb_average_grade: '',
        climb_hold_types: [], climb_sends: '', climb_wall_angle: [], climb_problem_types: [],
        climb_session_type: [], climb_ascent_method: '', climb_falls: '', climb_mental_load: '',
        conditioning_muscles_worked: [], yoga_type: '', yoga_breath_control: '', yoga_flexibility: '', yoga_focus: '', yoga_props_used: [],
        recovery_type: [], cardio_type: '', cardio_cycling_type: '', cardio_running_type: '', cardio_swimming_type: '', cardio_distance: '',
        session_notes: '', rpe: '', duration: '', injury_modifications: '', media: '', location: ''
      }));
    }
  };
  
  const gradeOptions = formData.climb_type==='Bouldering' ? boulderGrades : sportTradGrades;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-6">Log Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
      <label htmlFor="date" className="block mb-1 font-medium">Date</label>
<DatePicker
  selected={formData.date ? new Date(formData.date) : null}
  onChange={(date) => {
    setFormData(prev => ({
      ...prev,
      date: date ? date.toISOString().split('T')[0] : ''
    }));
  }}
  className="w-full border p-2 rounded bg-white"
  placeholderText="Select date"
  dateFormat="yyyy-MM-dd"
/>

        <label htmlFor="time_of_day" className="block mb-1 font-medium">Time of Day</label>
        <select name="time_of_day" value={formData.time_of_day} onChange={handleChange}
                className="w-full border p-2 rounded bg-white" required>
          {timeOfDayOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div>
            <label htmlFor="fatigue" className="block mb-1 font-medium">Fatigue Level</label>
          <select name="fatigue"  value={formData.fatigue} onChange={handleChange}
                  className="w-full border p-2 rounded bg-white" required>
            {scaleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
            <label htmlFor="mental" className="block mb-1 font-medium">Mental</label>
          <select name="mental" value={formData.mental} onChange={handleChange}
                  className="w-full border p-2 rounded bg-white" required>
            {scaleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {/* Multi-selects */}
        <MultiSelectDropdown label="Current Injuries" options={injuryOptions}
          selected={formData.current_injuries} onChange={sel => handleMulti('current_injuries', sel)} />
        <label htmlFor="activity_type" className="block mb-1 font-medium">Activity Type</label>
        <select name="activity_type" value={formData.activity_type} onChange={handleChange}
                className="w-full border p-2 rounded bg-white" required>
          {activityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {isIntroComplete() && formData.activity_type === 'Climbing' && (
          <>
            <label htmlFor="climb_type" className="block mb-1 font-medium">Climb Type</label>
            <select name="climb_type" value={formData.climb_type} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              <option value="">Climb Type</option>
              {climbTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label htmlFor="climb_location_type" className="block mb-1 font-medium">Climb Location Type</label>
            <select name="climb_location_type" value={formData.climb_location_type} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              <option value="">Climb Location</option>
              {climbLocationTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label htmlFor="climb_hardest_grade" className="block mb-1 font-medium">Hardest Grade</label>
            <select name="climb_hardest_grade" value={formData.climb_hardest_grade} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              <option value="">Hardest Grade</option>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <label htmlFor="climb_average_grade" className="block mb-1 font-medium">Average Grade</label>   
            <select name="climb_average_grade" value={formData.climb_average_grade} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              <option value="">Average Grade</option>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <MultiSelectDropdown label="Hold Types" options={holdTypeOptions}
              selected={formData.climb_hold_types} onChange={sel => handleMulti('climb_hold_types', sel)} />
              <label htmlFor="climb_sends" className="block mb-1 font-medium">Sends</label>
            <input type="number" name="climb_sends" value={formData.climb_sends}
                   onChange={handleChange} placeholder="Sends (optional)"
                   className="w-full border p-2 rounded bg-white" />
            <MultiSelectDropdown label="Wall Angles" options={wallAngleOptions}
              selected={formData.climb_wall_angle} onChange={sel => handleMulti('climb_wall_angle', sel)} />
            <MultiSelectDropdown label="Problem Types" options={problemTypeOptions}
              selected={formData.climb_problem_types} onChange={sel => handleMulti('climb_problem_types', sel)} />
            <MultiSelectDropdown label="Session Types" options={sessionTypeOptions}
              selected={formData.climb_session_type} onChange={sel => handleMulti('climb_session_type', sel)} />

            {(formData.climb_type === 'Sport' || formData.climb_type === 'Trad') && (
              <>
              <label htmlFor="climb_ascent_method" className="block mb-1 font-medium">Ascent Method</label>
                <select name="climb_ascent_method" value={formData.climb_ascent_method}
                        onChange={handleChange} className="w-full border p-2 rounded bg-white">
                  <option value="">Ascent Method (optional)</option>
                  {ascentMethodOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <label htmlFor="climb_falls" className="block mb-1 font-medium">Falls</label>
                <input type="number" name="climb_falls" value={formData.climb_falls}
                       onChange={handleChange} placeholder="Falls (optional)"
                       className="w-full border p-2 rounded bg-white" />
              </>
            )}
            
            {(formData.climb_type === 'Trad' || formData.climb_type === 'Free Solo') && (
                <><label htmlFor="climb_mental_load" className="block mb-1 font-medium">Mental Load</label>
                <select name="climb_mental_load" value={formData.climb_mental_load}
                              onChange={handleChange} className="w-full border p-2 rounded bg-white" required>
                              <option value="">Mental Load</option>
                              {scaleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select></>
            )}
          </>
        )}

        {isIntroComplete() && formData.activity_type === 'Conditioning' && (
          <MultiSelectDropdown label="Muscles Worked" options={conditioningMuscleOptions}
           selected={formData.conditioning_muscles_worked}
           onChange={sel => handleMulti('conditioning_muscles_worked', sel)} />
        )}

        {isIntroComplete() && formData.activity_type === 'Yoga' && (
          <>
            <label htmlFor="yoga_type" className="block mb-1 font-medium">Yoga Type</label>
            <select name="yoga_type" value={formData.yoga_type} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              <option value="">Yoga Type</option>
              {yogaTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label htmlFor="yoga_breath_control" className="block mb-1 font-medium">Breath Control</label>
            <select name="yoga_breath_control" value={formData.yoga_breath_control}
                    onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">Breath Control</option>
              {scaleOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label htmlFor="yoga_flexibility" className="block mb-1 font-medium">Flexibility</label>
            <select name="yoga_flexibility" value={formData.yoga_flexibility}
                    onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">Flexibility</option>
              {scaleOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label htmlFor="yoga_focus" className="block mb-1 font-medium">Focus</label>   
            <select name="yoga_focus" value={formData.yoga_focus}
                    onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">Focus</option>
              {scaleOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <MultiSelectDropdown label="Yoga Props" options={yogaPropsOptions}
              selected={formData.yoga_props_used}
              onChange={sel=>handleMulti('yoga_props_used',sel)} />
          </>
        )}

        {isIntroComplete() && formData.activity_type === 'Recovery' && (
          <MultiSelectDropdown label="Recovery Types" options={recoveryTypeOptions}
            selected={formData.recovery_type} onChange={sel=>handleMulti('recovery_type',sel)} />
        )}

        {isIntroComplete() && formData.activity_type === 'Cardio' && (
          <>
            <label htmlFor="cardio_type" className="block mb-1 font-medium">Cardio Type</label>
            <select name="cardio_type" value={formData.cardio_type} onChange={handleChange}
                    className="w-full border p-2 rounded bg-white" required>
              {cardioTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {formData.cardio_type==='Cycling' && (
                <><label htmlFor="cardio_cycling_type" className="block mb-1 font-medium">Ride Type</label>
                <select name="cardio_cycling_type" value={formData.cardio_cycling_type}
                              onChange={handleChange} className="w-full border p-2 rounded bg-white" required>
                              <option value="">Cycling Type</option>
                              {cyclingTypes.map(o => <option key={o} value={o}>{o}</option>)}
                          </select></>
            )}
            {formData.cardio_type==='Running' && (
                <><label htmlFor="cardio_running_type" className="block mb-1 font-medium">Run Type</label>
                <select name="cardio_running_type" value={formData.cardio_running_type}
                              onChange={handleChange} className="w-full border p-2 rounded bg-white" required>
                              <option value="">Running Type</option>
                              {runningTypes.map(o => <option key={o} value={o}>{o}</option>)}
                          </select></>
            )}
            {formData.cardio_type==='Swimming' && (
                <><label htmlFor="cardio_swimming_type" className="block mb-1 font-medium">Swim Type</label>
                <select name="cardio_swimming_type" value={formData.cardio_swimming_type}
                              onChange={handleChange} className="w-full border p-2 rounded bg-white" required>
                              <option value="">Swimming Type</option>
                              {swimmingTypes.map(o => <option key={o} value={o}>{o}</option>)}
                          </select></>
            )}
            {formData.cardio_type && formData.cardio_type !== 'Other' && (
                <><label htmlFor="cardio_distance" className="block mb-1 font-medium">Distance</label>
                <input type="number" name="cardio_distance" value={formData.cardio_distance}
                              onChange={handleChange} placeholder="Distance (km)"
                              className="w-full border p-2 rounded bg-white" required /></>
            )}
          </>
        )}


        {formData.activity_type !== 'Rest Day' && isDrilldownComplete() && (
          <>
            <label htmlFor="rpe" className="block mb-1 font-medium">RPE (Rate of Perceived Exertion)</label>
            <input type="number" name="rpe" value={formData.rpe} onChange={handleChange}
                   min="1" max="10" placeholder="RPE" className="w-full border p-2 rounded bg-white" required />
            <label htmlFor="duration" className="block mb-1 font-medium">Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange}
                   min="1" placeholder="Duration (min)" className="w-full border p-2 rounded bg-white" required />
            <label htmlFor="session_notes" className="block mb-1 font-medium">Session Notes</label>
            <textarea name="session_notes" value={formData.session_notes}
                      onChange={handleChange} placeholder="Session Notes"
                      className="w-full border p-2 rounded bg-white" />
            <label htmlFor="injury_modifications" className="block mb-1 font-medium">Injury Modifications</label>
            <textarea name="injury_modifications" value={formData.injury_modifications}
                      onChange={handleChange} placeholder="Injury Modifications"
                      className="w-full border p-2 rounded bg-white" />
            <label htmlFor="media" className="block mb-1 font-medium">Media (links)</label>
            <input type="text" name="media" value={formData.media}
                   onChange={handleChange} placeholder="Media (links)"
                   className="w-full border p-2 rounded bg-white" />
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input type="text" name="location" value={formData.location}
                   onChange={handleChange} placeholder="Optional Location" 
                   className="w-full border p-2 rounded bg-white" />
          </>
        )}

        {(formData.activity_type==='Rest Day' ||
          (isDrilldownComplete() && isGeneralComplete())) && (
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
