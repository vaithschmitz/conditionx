import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function LineChart({ data, xField, yFields, title = 'Line Chart' }) {
  if (!data?.length || !xField || !yFields?.length) return null;

  const xAxisData = data.map(item => item[xField]);

  const series = yFields.map(field => ({
    name: field.charAt(0).toUpperCase() + field.slice(1),
    type: 'line',
    smooth: true,
    data: data.map(item => item[field] ?? null),
    lineStyle: { width: 3 }
  }));

  const option = {
    title: {
      text: title,
      left: 'center',
      top: 0,
      textStyle: { fontSize: 16, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: yFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
      top: 30
    },
    grid: {
      top: 60,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      splitNumber: 5
    },
    series
  };

  return <ReactECharts option={option} style={{ height: 450, width: "100%" }} />;
}
