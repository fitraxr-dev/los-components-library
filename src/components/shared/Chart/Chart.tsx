import React from 'react';

import GroupedBarChart from './components/GroupedBarChart';
import PieChart from './components/PieChart';
import StackedBarChart from './components/StackedBarChart';

import type { ChartProps, StackedChartData, GroupedBarChartData, PieChartData } from './Chart.types';


const Chart = (props: ChartProps) => {

  const chartType = {
    'GROUPED_BAR': <GroupedBarChart chart_data={props.data as GroupedBarChartData} />,
    'PIE_BOTTOM': <PieChart chart_data={props.data as PieChartData[]} direction="bottom" />,
    'PIE_RIGHT': <PieChart chart_data={props.data as PieChartData[]} direction="right" />,
    'STACKED_BAR': <StackedBarChart chart_data={props.data as StackedChartData} />,
  };

  const renderChart = chartType[props.type];

  return renderChart;
};

export default Chart;
