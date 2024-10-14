import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress, Menu, Dropdown, Layout, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined,UserOutlined,MenuFoldOutlined,MenuUnfoldOutlined} from '@ant-design/icons';
import AddIncomeModal from '../../Modals/addIncome';
import AddExpenseModal from '../../Modals/addExpense'; // Import your expense modal
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import { Pie, Bar } from '@ant-design/charts';
import { Header } from 'antd/es/layout/layout';
import { useAuth } from '../../../context/AuthContext';
import AddSavingModal from '../../Modals/addSavings';


const TotalSavings = () => {
  const [isSavingModal, setIsSavingModal] = useState(false);
  const [savingData, setsavingData] = useState([]);
  const [isEditMode,setIsEditMode]= useState(false);
  const [selectedRecord,setSelectedRecord]= useState(null);
  const [collapsed, setCollapsed] = useState(false);
  
 const [name,setName]= useState("")
 const {logout} = useAuth();
 const {user}= useAuth();
 console.log(user?.user?.name)
 
 useEffect(()=>{
   setName(user?.user?.name.toUpperCase())
   fetchData()
 },[name])


 

  // Dummy data for income

  const totalIncome = savingData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = savingData.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = totalIncome - totalExpense; // Calculate savings
  
  const targetIncome = 0; // Set your target income here

  
  const data = savingData.map((item) => ({
    date: item.date,
    amount: item.amount,
    category: item.type,
  }));

const fetchData = async()=>{
  const token = localStorage.getItem("token")
  const response = await fetch("/api/saving/saving",{
    method:"GET",
    headers:{
      token:`${token}`
    }
    
  })
  if(!response.ok){
    console.log("Internal Error")
  }
  const data = await response.json();
  setsavingData(data);
}

const handleUpdate = (record) => {
  setIsEditMode(true);
  setSelectedRecord(record);
  setIsSavingModal(true); // Open the modal for editing
};

const showSavingModal = () => {
  setIsEditMode(false);
  setIsSavingModal(true);
};

const handleSavingCancel = () => {
  setIsSavingModal(false);
  setSelectedRecord(null); // Clear the selected record when closing the modal
};

const handleDelete = async(record) => {
  const token = localStorage.getItem("token")
  const response = await fetch(`/api/saving/saving/${record.id}`,{
    method:"DELETE",
    headers:{
      token:`${token}`
    }
    
  })
  if(!response.ok){
    console.log("Internal error in response of saving")
  }
  setsavingData(savingData.filter(item=> item.id !== record.id))
  message.success("Saving deleted Successfully")

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



  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => console.log('Edit Profile clicked')}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

 const toggleSidebar=()=>{
  setCollapsed(!collapsed)
 }

 

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
     {/* <Card title="Total Income" className='cards'n>
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
*/}
   <Card className='cards'>
    <div className='card-div'>
        <h2>Total Savings</h2>
        <Button type="primary" onClick={showSavingModal} className='btns'>
            Add Savings
        </Button>
    </div>
</Card>
      {/* Charts 
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
*/}


      {/* Income Table */}
      <div  style={{
        width: "100%",
        padding: "0rem 2rem",
        boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
        backgroundColor:"white",
        borderRadius:"0.5rem",
        marginTop:"1rem"
      }}>
        
      <Table scroll={{ x: 'max-content'}} columns={columns} dataSource={savingData}   pagination={false}  />
      </div>
      
      {/* Income Modal */}
      <AddSavingModal
        isSavingModalVisible={isSavingModal}
        handleSavingCancel={handleSavingCancel}
        onFinish={onFinish}
        savingData={savingData}
        setsavingData={setsavingData}
        isEditMode={isEditMode}
        selectedRecord={selectedRecord}
        fetchData= {fetchData}
      />
      
    
    </div>
    </div>
  );
};

export default TotalSavings;
