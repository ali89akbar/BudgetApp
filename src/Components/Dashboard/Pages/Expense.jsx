import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress, Menu, Layout, Dropdown,Avatar } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined,DownOutlined } from '@ant-design/icons';
import AddExpenseModal from '../../Modals/addExpense';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import { Pie, Bar } from '@ant-design/charts';
import Item from 'antd/es/list/Item';
import { Header } from 'antd/es/layout/layout';
import { useAuth } from '../../../context/AuthContext';

const ExpenseScreen = () => {
  const [isExpenseModal, setIsExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isEditMode,setIsEditMode]= useState(false);
  const [selectedRecord,setSelectedRecord]= useState(null);
  const [name, setName] = useState("")
  const {logout} = useAuth();
  const {user}= useAuth();
  console.log(user?.user?.name)

const fetchData= async ()=>{
  const token = localStorage.getItem('token');
  const response = await fetch('/api/expense/expense',{
    method:'GET',
    headers:{
      token:`${token}`
    }
  })
  if(!response.ok){
     console.log("Error while Fetching");
    
  }

  const data = await response.json();
  console.log(data)
  setExpenseData(data)
}

  useEffect(()=>{
    setName(user?.user?.name.toUpperCase())
    fetchData()
  },[name])

  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const targetExpense = 5000; // Set your target expense here

  const handleDelete=async(record)=>{
    const token = localStorage.getItem('token');
    try{
    const response = await fetch(`/api/expense/expense/${record.id}`,{
      method:'DELETE',
      headers:{
        token:`${token}`
      }
    })
    if(!response.ok){
      console.log("Error while deleting");
    }
    setExpenseData(expenseData.filter(item=> item.id !== record.id))
    message.success("Expense Deleted Successfully")
  }catch(error){
    console.error("Error:", error);
    message.error("Error while deleting expense")
  }
    
  }
 

  {/*const handleUpdate = async(record) => {
    setIsExpenseModal(true);
    setIsEditMode(true)
    setSelectedRecord(record)
    const token = localStorage.getItem("token");
    try{
    const response = await fetch(`api/expense/expense/${record.id}`,{
      method: "PUT",
      headers:{
        'Content-Type': 'application/json',
        token:`${token}`
      },
      body: JSON.stringify({
        amount: record.amount,
        type: "Expense",
        tag: record.tag,
        transaction_date: record.date
      }),
    })
    if(!response.ok){
      console.log("Error while updating");
    }
    const data = await response.json();
    setExpenseData(expenseData.map(item => item.id === data.id ? data : item))
    message.success("Expense Updated successfully")
    setIsEditMode(false)
    setIsExpenseModal(false)

  }
  catch(error){
    console.error("Error:", error);
    message.error("Error while updating expense")
  }
  
  };
*/}


  const data = expenseData.map((item) => ({
    date: item.date,
    amount: item.amount,
    category: item.type,
  }));

 

  const handleUpdate = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setIsExpenseModal(true); // Open the modal for editing
  };

  const showExpenseModal = () => {
    setIsEditMode(false);
    setIsExpenseModal(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModal(false);
    setSelectedRecord(null); // Clear the selected record when closing the modal
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
    {title:'No',dataIndex:'id',key:'id'},
    { title: 'Name', dataIndex: 'tag', key: 'tag' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'transaction_date', key: 'date' },
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
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => console.log('Edit Profile clicked')}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

  const toggleSidebar = () => {
    setCollapsed(!collapsed);  // Toggle the collapsed state
  };

  return (
    
    <div className='maindiv'>
      <Sidebar collapsed={collapsed} onCollapseChange={toggleSidebar}  />
      <div className='content'>
        <Layout>
          <Header className="header-div">
            <Button
            type='text'
            icon={collapsed? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
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
      <Card className='cards'>
    <div className='card-div'>
        <h2>Total Expense</h2>
        <Button type="primary" onClick={showExpenseModal} className='btns'>
            Add Expense
        </Button>
    </div>
</Card>


      {/* Charts 
      <div className='charts-wrapper'>
        <div className='chart-container'>
          <h2>Your Analytics</h2>
          <Bar {...config} />
        </div>

        <div className='charti'>
          <h2>Your Expense Distribution</h2>
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
     
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={expenseData}   pagination={false}  />
      
      </div>
      </div>
      {/* Expense Table */}
    
      {/* Expense Modal */}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModal}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
        expenseData={expenseData}
        setExpenseData={setExpenseData}
        selectedRecord={selectedRecord}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default ExpenseScreen;
