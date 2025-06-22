import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSession() {
  const [session, setSession] = useState();

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return session;
}
