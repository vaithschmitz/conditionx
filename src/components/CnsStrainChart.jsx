import { useMemo, useState } from "react";
import { computeCnsStrain } from "../lib/transformations/computeCnsStrain";
import ReactECharts from "echarts-for-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function CnsStrainChart({ data }) {
  const [showInfo, setShowInfo] = useState(false);

  const chartData = useMemo(() => {
    let prev = 0;
    return data.map((session, index) => {
      const recent = data.slice(Math.max(0, index - 7), index);
      const score = computeCnsStrain(session, recent, prev);
      prev = score;
      return { date: session.date, score };
    });
  }, [data]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.date),
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
    },
    series: [
      {
        name: "CNS Strain",
        type: "line",
        smooth: true,
        data: chartData.map((d) => d.score),
        lineStyle: { width: 3 },
        symbolSize: 8,
      },
    ],
  };

  return (
    <div className="cns-strain-chart">
      <header className="flex justify-between items-start mb-4">
        <div className="max-w-[90%]">
          <h2 className="text-xl font-semibold mb-1 text-primary">CNS Strain</h2>
          <p className="text-sm text-text-muted">
            Overall training readiness based on recovery, load and injury.
          </p>

          {showInfo && (
            <section className="text-sm mt-2 text-text-muted overflow-x-auto whitespace-nowrap">

              <p className="not-italic mb-2">
                Calculates Central Nervous System strain by factoring intensity (RPE), duration,
                mental effort, injury exposure, chronic load history, and recovery streaks. The model adapts based on training phase and decays during inactivity.
              </p>

              <div className="space-y-2 text-[0.9rem] overflow-x-auto">
                <BlockMath math={`
\\text{CNS}_t =
\\begin{cases}
\\min\\left(100,\\ \\max\\left(0,\\ (\\text{Load} + \\text{Injury} - \\text{Recovery}) \\cdot \\text{Adaptation} \\right) \\right), & \\text{if load > 0 or injury > 0} \\\\
\\text{CNS}_{t-1} \\cdot 0.85, & \\text{otherwise}
\\end{cases}
                `} />

                <BlockMath math={`
\\text{Load} = (2.5 \\cdot \\text{RPE} + 2.0 \\cdot \\text{Fatigue} + 1.5 \\cdot \\text{Mental}) \\cdot \\left(\\frac{\\text{Duration}}{60}\\right)
                `} />

                <BlockMath math={`
\\text{Injury} = 3.0 \\cdot \\text{Injuries} + 2.5 \\cdot \\text{Recurring Injuries}
                `} />

                <BlockMath math={`
\\text{Recovery} =
\\begin{cases}
15 + 7 \\cdot \\text{Streak}, & \\text{if recovery day} \\\\
0, & \\text{otherwise}
\\end{cases}
                `} />

                <BlockMath math={`
\\text{Adaptation} = \\min\\left(1.25,\\ \\max\\left(0.75,\\ \\frac{\\text{Load}}{\\text{ChronicLoad} + 1}\\right)\\right)
                `} />
              </div>
            </section>
          )}
        </div>

        <a
          href="#"
          className="text-sm text-foreground border border-border rounded px-2 py-0.5 hover:bg-muted"
          onClick={(e) => {
            e.preventDefault();
            setShowInfo(!showInfo);
          }}
        >
          {showInfo ? "Hide" : "Explain this"}
        </a>
      </header>

      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
