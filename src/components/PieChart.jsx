import React from "react";
import ReactECharts from "echarts-for-react";

export default function PieChart({ data }) {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const name = params.name || '';
        const val = params.data.realValue ?? params.value;
        return `${name}: ${val}`;
      }
    },
    series: [
      {
        type: "pie",
        data: data,
        radius: "50%",
        sort: null,
      }
    ], 
    label: {
      show: true,
      formatter: '{b} ({c})',
      position: 'inside'
    },
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 450, width: "100%" }}
    />
  );
}

