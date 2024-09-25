import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Chart, PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AddIncomeModal from '../../Modals/addIncome';
import Sidebar from '../Sidebar/Sidebar';

Chart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale);

const IncomeScreen = () => {
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

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

  const pieData = {
    labels: ['Name', 'Freelancing', 'Other'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  const barData = {
    labels: ['Name', 'Freelancing', 'Other'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 700, 300],
        backgroundColor: '#3f51b5',
      },
    ],
  };

  useEffect(() => {
    const ctxPie = document.getElementById('incomePieChart');
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the previous instance
    }

    const newChartInstance = new Chart(ctxPie, {
      type: 'pie',
      data: pieData,
    });

    setChartInstance(newChartInstance);

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [incomeData]);

  useEffect(() => {
    const ctxBar = document.getElementById('incomeBarChart');
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the previous instance
    }

    const newChartInstance = new Chart(ctxBar, {
      type: 'bar',
      data: barData,
    });

    setChartInstance(newChartInstance);

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [incomeData]);

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

  return (
    <div style={{ padding: '20px',marginBottom:"240px" }}>
      <Sidebar/>
      <Card title="Total Income">
        <p>Total Income: $7000</p>
        <Button type="primary" onClick={showIncomeModal}>
          Add Income
        </Button>
      </Card>

      {/* Row for Pie and Bar Charts */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        {/* Pie Chart */}
        <Col span={12}>
          <Card title="Income Breakdown">
            <canvas id="incomePieChart" width="400" height="400"></canvas>
          </Card>
        </Col>

        {/* Bar Graph */}
        <Col span={12}>
          <Card title="Income Over Time">
            <canvas id="incomeBarChart" width="400" height="400"></canvas>
          </Card>
        </Col>
      </Row>

      {/* Income Table */}
      <Table columns={columns} dataSource={incomeData} />

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
