import { useEffect, useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import PieChart from "../../components/PieChart";
import { fieldSchema } from "../../lib/fieldSchema";
import { countActivitiesAndSubtypes } from "../../lib/transformations/countActivitiesAndSubtypes";

export default function OverviewPage() {
  const [data, setData] = useState([]);
//   might use this for spinners
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false })
        .limit(50);
        
        console.log(data)
      if (!error) setData(data);
      setLoading(false);
      console.log(data)
    };

    fetchSessions();
  }, []);

  
  const activityBreakdown = data.length ? countActivitiesAndSubtypes(data) : null;

  if (activityBreakdown) {
    console.log(activityBreakdown);
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-text">Training Cockpit</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Activity by Type</h2>
          <p className="text-sm text-text-muted">Distribution across training categories.</p>
          <PieChart data={data} width={200} height={200} />
        </div>
    {/* {cleanDataPie(data)} */}
        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">RPE vs Fatigue</h2>
          <p className="text-sm text-text-muted">Compare perceived exertion to fatigue trends.</p>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Time Breakdown</h2>
          <p className="text-sm text-text-muted">How you're spending your training time.</p>
        </div>
      </div>
    </div>
  );
}
