import WordCloud from '../../components/WordCloud';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext'; // ✅ adjust path if needed


export default function NotesCloudPage() {
    const { session } = useAuth();
    const [notes, setNotes] = useState([]);
  
    useEffect(() => {
      if (!session?.user?.id) return;
  
      const fetchNotes = async () => {
        const { data, error } = await supabase
          .from('workouts')
          .select('session_notes')
          .eq('user_id', session.user.id)
          .not('session_notes', 'is', null);
  
        if (!error) {
          setNotes(data.map(n => n.session_notes));
        } else {
          console.error('Fetch error:', error.message);
        }
      };
  
      fetchNotes();
    }, [session]);

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded shadow text-black">
          <h1 className="text-2xl font-bold mb-6">Frequent Phrase</h1>
          <WordCloud textArray={notes} width={600} height={400} />
        </div>
      );
    }

// export default function Recovery() {
//     return (
//       <div className="bg-white shadow p-6 rounded-xl">
//         <h1 className="text-2xl font-semibold mb-2 text-gray-900">Recovery</h1>
//         <p className="text-gray-600">Recovery data visualizations will live here.</p>
//       </div>
//     )
//   }
  