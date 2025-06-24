// src/pages/dashboard/OverviewPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PieChart from "../../components/PieChart";
import { countActivitiesForPieChart } from "../../lib/transformations/countActivitiesForPieChart";

export default function OverviewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false });

      if (!error && data) setData(data);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const pieData = !loading && data.length
    ? countActivitiesForPieChart(data)
    : [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-text">Training Cockpit</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Activity by Type</h2>
          <p className="text-sm text-text-muted">Drill into subtypes visually.</p>
          {!loading && <PieChart data={pieData} />}
        </div>
      </div>
    </div>
  );
}
