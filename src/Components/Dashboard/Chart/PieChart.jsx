import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = ({ sorted }) => {
  // Filter the data correctly based on the "type"
  const filters = sorted.map((item) => {
    return { type: item.tag, amount: item.amount };
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
    width: 300,  // Set width for medium size
    height: 300, // Set height for medium size
  };

  return <Pie {...configs} />;
};

export default PieChart;
