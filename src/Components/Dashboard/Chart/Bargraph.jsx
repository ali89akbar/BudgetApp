import React from 'react';
import { Bar, Pie } from '@ant-design/charts';
import PieChart from './PieChart';
import './Chart.css'

const BarChart = ({ sorted }) => {
  // Assume that `sorted` contains { date, amount, category } for each item
  const data = sorted.map((item) => {
    return { date: item.date, amount: item.amount, category: item.type};
  });

 


  const config = {
    data,
    xField: 'date', // Dates on the x-axis
    yField: 'amount', // Amounts on the y-axis
    seriesField: 'category', // This enables grouping by category
    colorField: 'category', // Category colors (Income, Expense, Savings)
    color: {
      Income: '#36cfc9',  // Color for Income
      Expense: '#ff4d4f', // Color for Expense
      Savings: '#73d13d', // Color for Savings
    },
    barWidthRatio: 0.5,
    legend: true, // Show legend for the categories
    xAxis: {
      label: {
        formatter: (v) => v, // Keep dates as they are
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `$${v}`, // Format amount as currency on y-axis
      },
    },
    barStyle: {
      radius: [4, 4, 0, 0], // Rounded top corners
    },
    width: 300,  // Set width for medium size
    height: 300, // Set height for medium size
  };
  

  /* const filters = sorted
    .filter((item) => item.type === 'income' || item.type === 'expense')
    .map((item) => {
      return { type: item.type, amount: item.amount };
    });


  const configs = {
    appendPadding: 5,
    data: filters, // Use the filtered data
    angleField: 'amount', // The field that represents the value
    colorField: 'type',   // The field that represents the type (Income, Expense, Savings)
    radius: 1,
    label: {
      type: 'spider',
      labelHeight: 18,
      content: '{name}\n{percentage}', // Display the percentage of each slice
    },
    interactions: [{ type: 'element-active' }],
    width: 400,  // Set width for medium size
     // Set height for medium size
  };*/
  return(
    <div className='charts-wrapper'>
      <div className='chart-container'>
      <h2>Your Analytics</h2>
      <Bar
      {...config} 
      />
      </div>

      <div>
      <h2>Your Spendings</h2>
      <PieChart sorted={sorted}  {...config} />
      </div>
    </div>
  );
};

export default BarChart;
