import React, { useState } from 'react';
import { Pie } from '@ant-design/charts';
import { Dropdown, Menu, Button } from 'antd';

const PieChart = ({ sorted }) => {
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const monthlyData = (sorted || []).reduce((acc, { amount, type, transaction_date }) => {
    const numericAmount = parseFloat(amount);
    const month = new Date(transaction_date).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = { totalIncome: 0, totalExpense: 0 };
    }
    if (type === 'income') {
      acc[month].totalIncome += numericAmount;
    } else if (type === 'expense') {
      acc[month].totalExpense += numericAmount;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyData);
  const totalsForMonth = monthlyData[selectedMonth] || { totalIncome: 0, totalExpense: 0 };

  const data = [
    { amount: totalsForMonth.totalIncome, category: 'Income' },
    { amount: totalsForMonth.totalExpense, category: 'Expense' },
  ].filter(item => item.amount > 0); 

  const configs = {
    appendPadding: 5,
    data,
    angleField: 'amount',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'spider',
      content: (item) => `${item.category}: $${item.amount.toFixed(2)} (${item.percentage})`,
    },
    height:500,
    width:330,
    interactions: [{ type: 'element-active' }],
  };

  const handleMenuClick = (e) => {
    setSelectedMonth(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {months.map((month) => (
        <Menu.Item key={month} style={{ padding: '4px 8px' }}>{month}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      {data.length > 0 && (
        <div >
          <Pie {...configs} />
      <Dropdown overlay={menu} trigger={['click']}>
        <Button className='pieBtn' >
          {selectedMonth} <span aria-hidden="true">▼</span>
        </Button>
      </Dropdown>
        </div>
      )}
    </div>
  );
};

export default PieChart;

