import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress, Layout, Dropdown, Avatar, Menu } from 'antd';
import { EditOutlined, DeleteOutlined,MenuFoldOutlined,UserOutlined,MenuUnfoldOutlined } from '@ant-design/icons';

import AddIncomeModal from '../../Modals/addIncome';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import '../Chart/Chart.css'
import '../card.css'
import { Pie, Bar } from '@ant-design/charts';
import { Header } from 'antd/es/layout/layout';
import { useAuth } from '../../../context/AuthContext';

const IncomeScreen = () => {
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRecord,setSelectedRecord] = useState(null);
  const [isEditMode,setIsEditMode] = useState(false);

 const [name,setName]= useState("")
  const {logout} = useAuth();
  const {user}= useAuth();
  console.log(user?.user?.name)



  
  

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const targetIncome = 10000; // Set your target income here


  const fetchData = async()=>{
    const token = localStorage.getItem("token")
    const response = await fetch("/api/income/views",{
      method:"GET",
      headers:{
        token:`${token}`
      }
    })
    if(!response.ok){
      console.log("Response not found");
    }
    const data = await response.json();
    setIncomeData(data)
  }
  

  useEffect(()=>{
    setName(user?.user?.name.toUpperCase())
    fetchData()
  },[name])
 
  const handleDelete = async (record) => {
    const token = localStorage.getItem("token")
    try{
      const response = await fetch(`/api/income/deletes/${record.id}`,{
        method:"DELETE",
        headers:{
          token:`${token}`
        }
      })
      if(!response.ok){
          console.log("Internal issue deleting")
      }
   
      setIncomeData(incomeData.filter(item => item.id !== record.id));
      message.success('Income deleted successfully');

    }
    catch(error){
      console.log("Error While Deleting Record: " + error)
    }
  };


  const handleUpdate = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setIsIncomeModal(true)
  };

  const data = incomeData.map((item) => {
    return { date: item.date, amount: item.amount, category: item.type};
  });

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => console.log('Edit Profile clicked')}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

 const toggleSidebar=()=>{
  setCollapsed(!collapsed)
 }


 

  const showIncomeModal = () => {
    setIsEditMode(false);
    setIsIncomeModal(true);

  };

  const handleIncomeCancel = () => {
    setIsIncomeModal(false);
    setSelectedRecord(null);
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
    {title:"No",dataIndex:"id",key:"id"},
    { title: 'Name', dataIndex: 'tag', key: 'tag' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'transaction_date', key: 'transaction_date' },
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


  return (
    <div className='maindiv'>
            
    <Sidebar collapsed={collapsed} onCollapseChange={toggleSidebar}  />
     <div className='content'>
     <Layout>
      <Header
        className='header-div'
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>{name}</span>
          <Dropdown overlay={menu}>
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    </Layout>


     <Card className='cards' style={{padding:"0px"}}>
      
    <div className='card-div'>
        <h2>Total Income</h2>
        <Button type="primary" onClick={showIncomeModal} className='btns'>
            Add Income
        </Button>
    </div>
</Card>

      {/* Charts 
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
      */}
    <div  style={{
        width: "100%",
        padding: "0rem 2rem",
        boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
        backgroundColor:"white",
        borderRadius:"0.5rem",
        marginTop:'1rem'
      }}>
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={incomeData}   pagination={false}  />
      </div>
     </div>

      {/* Income Table */}

      {/* Income Modal */}
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModal}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
        incomeData={incomeData}
        setIncomeData = {setIncomeData}
        selectedRecord={selectedRecord}
        isEditMode={isEditMode}
        fetchData={fetchData}
      />
    </div>
  );
};

export default IncomeScreen;
