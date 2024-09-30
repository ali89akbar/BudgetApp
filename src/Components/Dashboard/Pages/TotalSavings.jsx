import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddIncomeModal from '../../Modals/addIncome';
import AddExpenseModal from '../../Modals/addExpense'; // Import your expense modal
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import { Pie, Bar } from '@ant-design/charts';

const TotalSavings = () => {
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [isExpenseModal, setIsExpenseModal] = useState(false); // New state for expense modal
  const [savingData, setsavingData] = useState([]);
  const [incomeData, setIncomeData] = useState([]) // Income data
  const [expenseData, setExpenseData] = useState([]); // Expense data
  const [collapsed, setCollapsed] = useState(false);

  // Dummy data for income
  const dummyIncomeData = [
    {
      key: '1',
      Name: 'Software Engineer',
      amount: 5000,
      tag: 'Job',
      type: 'Salary',
      date: '2024-09-20',
    },
    {
      key: '2',
      Name: 'Freelance Project',
      amount: 2000,
      tag: 'Freelancing',
      type: 'Freelancing',
      date: '2024-09-22',
    },
  ];

  // Dummy data for expenses
  const dummyExpenseData = [
    {
      key: '1',
      Name: 'Rent',
      amount: 1200,
      tag: 'Housing',
      type: 'Monthly',
      date: '2024-09-01',
    },
    {
      key: '2',
      Name: 'Groceries',
      amount: 300,
      tag: 'Food',
      type: 'Monthly',
      date: '2024-09-15',
    },
  ];

  useEffect(() => {
    setIncomeData(dummyIncomeData);
    setExpenseData(dummyExpenseData); // Initialize expense data
  }, []);

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = totalIncome - totalExpense; // Calculate savings
  
  const targetIncome = 0; // Set your target income here

  const pieDataIncome = incomeData.map(item => ({
    type: item.tag,
    value: item.amount,
  }));

  const pieDataExpense = expenseData.map(item => ({
    type: item.tag,
    value: item.amount,
  }));

  const data = incomeData.map((item) => ({
    date: item.date,
    amount: item.amount,
    category: item.type,
  }));

  const config = {
    data,
    xField: 'date',
    yField: 'amount',
    seriesField: 'category',
    colorField: 'category',
    color: {
      Income: '#36cfc9',
      Expense: '#ff4d4f',
    },
    barWidthRatio: 0.5,
    legend: true,
    xAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `$${v}`,
      },
    },
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    // width: 500,
    // height: 300,
  };

  const pieConfigIncome = {
    data: pieDataIncome,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    width:200,
    height:200,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const pieConfigExpense = {
    data: pieDataExpense,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    width:200,
    height: 200,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const showIncomeModal = () => {
    setIsIncomeModal(true);
  };

  const showExpenseModal = () => {
    setIsExpenseModal(true); // Open expense modal
  };

  const handleIncomeCancel = () => {
    setIsIncomeModal(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModal(false); // Close expense modal
  };

  const onIncomeFinish = (values) => {
    const newData = {
      key: Date.now().toString(),
      Name: values.name,
      amount: values.amount,
      tag: values.tag,
      type: values.type,
      date: values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };

    setsavingData([...savingData, newData]);
    message.success('Income added successfully');
    setIsIncomeModal(false);
  };

  const onExpenseFinish = (values) => {
    const newData = {
      key: Date.now().toString(),
      Name: values.name,
      amount: values.amount,
      tag: values.tag,
      type: values.type,
      date: values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };

    setExpenseData([...expenseData, newData]); // Add new entry to expense data
    message.success('Expense added successfully');
    setIsExpenseModal(false); // Close modal after adding expense
  };

  const columns = [
    { title: 'Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleUpdate(record)} style={{ color: 'blue', cursor: 'pointer' }} />
          <DeleteOutlined onClick={() => handleDelete(record)} style={{ color: 'red', cursor: 'pointer' }} />
        </Space>
      ),
    },
  ];

  const handleUpdate = (record) => {
    message.info('Update clicked for ' + record.Name);
  };

  const handleDelete = (record) => {
    setsavingData(savingData.filter(item => item.key !== record.key));
    message.success('Income deleted successfully');
  };

  const handleCollapseChange = (value) => {
    setCollapsed(value);
  };

  const contentStyle = {
    marginLeft: collapsed ? '30px' : '50px',
    transition: 'margin-left 0.3s ease',
  };

  return (
    <div className='maindiv'>
      <Sidebar onCollapseChange={handleCollapseChange} />
      <div className='content'>
      <Card title="Total Income" className='cards'n>
        <p>Total Income: ${totalIncome}</p>
        <p>Total Expense: ${totalExpense}</p>
        <p>Total Savings: ${totalSavings}</p>
        <Progress percent={(totalIncome / targetIncome) * 100} />
        <Button type="primary" onClick={showIncomeModal}>
          Add Income
        </Button>
        <Button type="default" onClick={showExpenseModal} style={{ marginLeft: '10px' }}>
          Add Expense
        </Button>
      </Card>

      {/* Charts */}
      <div className='charts-wrapper' >
        <div className='chart-container'>
          <h2>Your Income Analytics</h2>
          <Bar {...config} />
        </div>
        <div>
          <h2>Your Income Distribution</h2>
          <Pie {...pieConfigIncome} />
        
        
          <h2>Your Expense Distribution</h2>
          <Pie {...pieConfigExpense} />
        </div>
      </div>

      {/* Income Table */}
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={incomeData}  />

      {/* Income Modal */}
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModal}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onIncomeFinish}
      />
      
      {/* Expense Modal */}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModal}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onExpenseFinish}
      />
    </div>
    </div>
  );
};

export default TotalSavings;
