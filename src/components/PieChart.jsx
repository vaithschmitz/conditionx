import React from 'react';
import { Pie } from '@visx/shape';

export default function PieChart({ data, width, height }) {
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <svg width={width} height={height}>
      <Pie
        data={data}
        pieValue={d => d.value}
        outerRadius={radius}
        innerRadius={radius * 0.5}
        padAngle={0.02}
      >
        {pie => (
          <g transform={`translate(${centerX}, ${centerY})`}>
            {pie.arcs.map((arc, i) => {
              const arcPath = pie.path(arc);
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const color = arc.data.color || `hsl(${(i / data.length) * 360}, 70%, 60%)`;

              return (
                <g key={`arc-${i}`}>
                  <path d={arcPath} fill={color} />
                  <text
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={12}
                    textAnchor="middle"
                    fill="white"
                  >
                    {arc.data.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </Pie>
    </svg>
  );
}
