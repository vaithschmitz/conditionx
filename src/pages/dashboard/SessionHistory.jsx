import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import SessionsList from '../../components/SessionsList';

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    if (!error) setSessions(data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdate = async (id, updates) => {
    const { error } = await supabase.from('workouts').update(updates).eq('id', id);
    if (error) {
        console.error('Supabase update error:', error.message, error.details);
      } else {
        fetchSessions();
      }
    // if (!error) fetchSessions();
  };

  return (
    <div className="space-y-8 px-4 py-6">
      <h1 className="text-3xl font-bold tracking-tight text-text">Session History</h1>

      <SessionsList
        sessions={sessions}
        onUpdate={async (id, updates) => {
            await supabase.from('workouts').update(updates).eq('id', id);
          
            // sort by date but keep position locked if same date
            const { data } = await supabase
              .from('workouts')
              .select('*')
              .order('date', { ascending: false })
              .limit(10);
          
            if (data) {
              const indexed = data.map((item, i) => ({ ...item, _originalIndex: i }));
          
              indexed.sort((a, b) => {
                const dateDiff = new Date(b.date) - new Date(a.date);
                return dateDiff !== 0 ? dateDiff : a._originalIndex - b._originalIndex;
              });
          
              setSessions(indexed);
            }
          }}
          
        />

    </div>
  );
}