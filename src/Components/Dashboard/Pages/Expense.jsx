import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddExpenseModal from '../../Modals/addExpense';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import { Pie, Bar } from '@ant-design/charts';

const ExpenseScreen = () => {
  const [isExpenseModal, setIsExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // Dummy data for expenses
  const dummyData = [
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
    setExpenseData(dummyData);
  }, []);

  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const targetExpense = 5000; // Set your target expense here

  const pieData = expenseData.map(item => ({
    type: item.tag,
    value: item.amount,
  }));

  const data = expenseData.map((item) => ({
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
      Monthly: '#36cfc9',
      OneTime: '#ff4d4f',
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
    // width:500,
    // height: 300,
  };

  const pieConfig = {
    data: pieData,
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
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const showExpenseModal = () => {
    setIsExpenseModal(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModal(false);
  };

  const onFinish = (values) => {
    const newData = {
      key: Date.now().toString(),
      Name: values.name,
      amount: values.amount,
      tag: values.tag,
      type: values.type,
      date: values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };

    setExpenseData([...expenseData, newData]);
    message.success('Expense added successfully');
    setIsExpenseModal(false);
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
    setExpenseData(expenseData.filter(item => item.key !== record.key));
    message.success('Expense deleted successfully');
  };

  const handleCollapseChange = (value) => {
    setCollapsed(value);
  };

  const contentStyle = {
    marginLeft: collapsed ? '30px' : '50px', // Adjust margin based on sidebar's width
    transition: 'margin-left 0.3s ease',
  };

  return (
    <div className='maindiv'>
      <Sidebar  onCollapseChange={handleCollapseChange}  />
      <div className='content'>
      <Card title="Total Expense"  >
        <p>Total Expense: ${totalExpense}</p>
        <Progress percent={targetExpense > 0 ? (totalExpense / targetExpense) * 100 : 0} />
        <Button type="primary" onClick={showExpenseModal}>
          Add Expense
        </Button>
      </Card>

      {/* Charts */}
      <div className='charts-wrapper'>
        <div className='chart-container'>
          <h2>Your Analytics</h2>
          <Bar {...config} />
        </div>

        <div>
          <h2>Your Expense Distribution</h2>
          <Pie {...pieConfig} />
        </div>
      </div>
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={expenseData} style={contentStyle} />

      </div>
      {/* Expense Table */}
    
      {/* Expense Modal */}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModal}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
    </div>
  );
};

export default ExpenseScreen;
