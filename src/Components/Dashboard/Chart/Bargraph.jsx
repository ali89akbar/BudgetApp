import React from 'react';
import { Bar, Pie } from '@ant-design/charts';
import PieChart from './PieChart';
import './Chart.css'
import '../Pages/pages.css'
const BarChart = ({ sorted }) => {
  if(!sorted){
    console.log(sorted)
  }
  console.log(sorted+"SORTEED")
  // Assume that `sorted` contains { date, amount, category } for each item
  //const data = sorted.map((item) => {
   // return { date: item.date, amount: item.amount, category: item.type};
  //});

 


  
// const monthNames = ["January", "February", "March", "April", "May", "June",
  //  "July", "August", "September", "October", "November", "December"];

//const currentMonthIndex = new Date().getMonth(); // Get the current month index

{/* const filteredData = sorted
.map((item) => {
const date = new Date(item.date);
return {
month: monthNames[date.getMonth()], // Use month name instead of date
amount: item.amount,
category: item.type
};
})

console.log(`Current date is ${filteredData}`)
*/}
const data = Object.entries(sorted).map(([month, { income, expense }]) => [
  { month, amount: income, category: 'Income' },
  { month, amount: expense, category: 'Expense' },
]).flat();

const config = {
data,
xField: 'month', // Now using month as xField
yField: 'amount', 
seriesField: 'category', 
colorField: 'category', 
color: {
Income: '#36cfc9',  
Expense: '#ff4d4f', 
Savings: '#73d13d', 
},
barWidthRatio: 0.5,
legend: true, // Show legend for the categories
xAxis: {
label: {
formatter: (v) => v, // Keep month names as they are
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
//width: 400,  // Set width for medium size
//height: 500, // Set height for medium size
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
    <div className='charts-wrapper' >
      <div className='chart-container'>
      <h2>Your Analytics</h2>
      <Bar
      {...config} 
      />
      </div>

      <div className='charti'>
      <h2>Your Spendings</h2>
      <PieChart sorted={sorted}  />
      </div>
    </div>
  );
};

export default BarChart;
