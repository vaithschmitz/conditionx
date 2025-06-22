import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from "../context/AuthContext";

export default function DashboardDebug() {
  const { session } = useAuth();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!session) return;

    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('date, activity_type, rpe, fatigue')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching workouts:', error.message);
      } else {
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, [session]);

  if (!session) return <p className="text-gray-500">Not logged in</p>;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Workout Log Preview</h2>
      {workouts.length === 0 && <p className="text-gray-400">No data found</p>}
      <ul className="space-y-1">
        {workouts.map((w, idx) => (
          <li
            key={idx}
            className="bg-white border border-gray-200 rounded p-3 shadow-sm text-sm"
          >
            <strong>{w.activity_type}</strong> on {w.date} | RPE: {w.rpe} | Fatigue: {w.fatigue}
          </li>
        ))}
      </ul>
    </div>
  );
}
