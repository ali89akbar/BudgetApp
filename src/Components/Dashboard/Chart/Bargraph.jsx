import React from 'react';
import { Bar, Pie } from '@ant-design/charts';
import PieChart from './PieChart';
import './Chart.css'
import '../Pages/pages.css'
import { toPadding } from 'chart.js/helpers';

const BarChart = ({ sorted, pieChartData }) => {
  const data = Object.entries(sorted).map(([month, { income, expense }]) => [
  { month, amount : income, category: 'Income' },
  { month, amount : expense, category: 'Expense' },
  ]).flat();

  const isSingleMonth = data.length === 2; 
  const config =
 {
  data,
  xField : 'month', // Months on the X-axis (horizontal)
  yField : 'amount',  // Values (income and expense) on the Y-axis (vertical)
  seriesField: 'category',
  colorField : 'category',
  color: {
    Income  : '#36cfc9',
    Expense : '#ff4d4f',
    Savings : '#73d13d',
  },
  style:{
    maxWidth : 55,
  },
  xAxis: {
    label: {
      style: {
        fontSize: 12,
        fill    : '#595959',
      },
    },
    line: {
      style: {
        stroke : '#d9d9d9',
      },
    },
  },
  yAxis: {
    title: {
      text : 'Amount ($)',
      style: {
        fontSize : 14,
        fill : '#595959',
      },
    },
    label: {
      formatter : (v) => `$${v}`, 
      style: {
        fontSize : 12,
        padding  : 5,
      },
    },
  },
  barWidthRatio : 0.2, 
  barStyle: {
    radius      : [4, 4, 0, 0],
    fillOpacity : 0.8,
    lineWidth   : 1,
    stroke      : '#fff',
  },
  height  : isSingleMonth ? 400 : 500,
  legend: {
    position : 'top-left',
  },
  minColumnWidth : 15, 
  maxColumnWidth : 25, 
  };

return (
  <div className = 'charts-wrapper'>
    <div className = 'chart-container'>
      <h2>Your Analytics</h2>
      <Bar {...config} />
    </div>
 
      <div className = 'charti'>
      <h2>Your Spendings</h2>
      <PieChart sorted = {pieChartData}  />
      </div>
    </div>
  );
};

export default BarChart;
