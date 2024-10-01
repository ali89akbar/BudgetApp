import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddIncomeModal from '../../Modals/addIncome';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import '../Chart/Chart.css'
import '../card.css'
import { Pie, Bar } from '@ant-design/charts';

const IncomeScreen = () => {
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // Dummy data for income
  const dummyData = [
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

  useEffect(() => {
    setIncomeData(dummyData);
  }, []);

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const targetIncome = 10000; // Set your target income here

  const pieData = incomeData.map(item => ({
    type: item.tag,
    value: item.amount,
  }));

  const data = incomeData.map((item) => {
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
    // width: 500,  // Set width for medium size
    // height: 300, // Set height for medium size
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
      
    },
    //width:400,
    //height:400,
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const showIncomeModal = () => {
    setIsIncomeModal(true);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModal(false);
  };

  const onFinish = (values) => {
    const newData = {
      key: Date.now().toString(), // Unique key for new entry
      Name: values.name,
      amount: values.amount,
      tag: values.tag,
      type: values.type,
      date: values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };

    setIncomeData([...incomeData, newData]); // Add new entry to income data
    message.success('Income added successfully');
    setIsIncomeModal(false); // Close modal after adding income
  };

  // Table columns with icons
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
    setIncomeData(incomeData.filter(item => item.key !== record.key));
    message.success('Income deleted successfully');
  };

  const handleCollapseChange = (value) => {
    setCollapsed(value);
  };





  return (
    <div className='maindiv'>
            
    <Sidebar  />
     <div className='content' >
     <Card title="Total Income"  className='cards'>
        <p>Total Income: ${totalIncome}</p>
        <Progress percent={(totalIncome / targetIncome) * 100} />
        <Button type="primary" onClick={showIncomeModal} className='btns'>
          Add Income
        </Button>
      </Card>

      {/* Charts */}
      <div className='charts-wrapper'>
        <div className='chart-container' >
          <h2>Your Analytics</h2>
          <Bar {...config} />
        </div>

        <div  className='charti'>

          <h2>Your Income Distribution</h2>
          <Pie {...pieConfig} />
        </div>
      </div>
      <div className="main-table">
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={incomeData}   pagination={false}  />
      </div>
     </div>

      {/* Income Table */}

      {/* Income Modal */}
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModal}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
    </div>
  );
};

export default IncomeScreen;
