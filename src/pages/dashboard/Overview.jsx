// src/pages/dashboard/OverviewPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";
import CnsStrainChart from "../../components/CnsStrainChart";
import { countActivitiesForPieChart } from "../../lib/transformations/countActivitiesForPieChart";

export default function OverviewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*");

      if (!error && data) {
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(sortedData);
      }

      setLoading(false);
    };

    fetchSessions();
  }, []);

  const pieData = !loading && data.length ? countActivitiesForPieChart(data) : [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-text">Training Cockpit</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Activity Split</h2>
          <p className="text-sm text-text-muted">Diversity creates success.</p>
          {!loading && <PieChart data={pieData} />}
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Effort vs Perceived Load</h2>
          <p className="text-sm text-text-muted">Smoothed over time.</p>
          {!loading && (
            <LineChart
              data={data}
              xField="date"
              yFields={["rpe", "fatigue"]}
              title="RPE vs Fatigue"
            />
          )}
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <CnsStrainChart data={data} />
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Recovery Ratio (Coming Soon)</h2>
          <p className="text-sm text-text-muted">Balance across rest, recovery, and training.</p>
          {!loading && <PieChart data={pieData} />}
        </div>
      </div>
    </div>
  );
}
