import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Modal, Input, Menu, Dropdown, Layout, Avatar, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AddSavingModal from '../../Modals/addSavings';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import { DatePicker } from 'antd'; 
import { unparse } from 'papaparse';
import Heads from '../Header/Heads';

const TotalSavings = () => {
  const [isSavingModal, setIsSavingModal] = useState(false);
  const [savingData, setSavingData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetMonth, setTargetMonth] = useState(null);
  const [isTargetModalVisible, setIsTargetModalVisible] = useState(false);
  const [newTarget, setNewTarget] = useState(targetAmount);
  const [sortKey,setSortKey] = useState("");
  const [search,setSearch]=useState("");
  const [monthFilter,setMonthFilter]        = useState("")
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paginationData, setPaginationData] = useState({
    currentPage : 1,
    totalPages  : 0,
    pageSize    : 10, // Default page size
  });
  
  useEffect(() => {
    setName(user?.user?.name.toUpperCase());
    fetchData();
    const savedTarget = localStorage.getItem("savingsTarget");
    if (savedTarget) {
      const { amount, month } = JSON.parse(savedTarget);
      setTargetAmount(amount);
      setTargetMonth(month);
    }
  }, [name]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/saving/saving", {
      method: "GET",
      headers: { token: `${token}` }
    });
    if (!response.ok) {
      message.error("Internal Issue");
      return;
    }
    const data = await response.json();
    const uniqueData = getUniqueTransactions(data); // Get unique transactions
    setSavingData(uniqueData.map(item => ({
      ...item,
      status: calculateStatus(item.amount, item.transaction_date.split("-")[1]) // Calculate status based on month
    })));
  };

  const calculateStatus = (amount, month) => {
    const totalSavingsForMonth = savingData
      .filter(item => item.transaction_date.startsWith(month))
      .reduce((acc, curr) => acc + curr.amount, 0) + amount;

    return totalSavingsForMonth >= targetAmount ? 'Achieved' : 'In Progress';
  };


  const handleUpdate = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setIsSavingModal(true);
  };

  const handleSavingCancel = () => {
    setIsSavingModal(false);
    setSelectedRecord(null);
  };

  const handleDelete = async (record) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/saving/saving/${record.id}`, {
      method: "DELETE",
      headers: { token: `${token}` }
    });
    if (!response.ok) {
      message.error("Error deleting saving");
      return;
    }
    setSavingData(savingData.filter(item => item.id !== record.id));
    message.success("Saving deleted successfully");
  };

  const onFinish = (values) => {
    const newData = {
      amount: values.amount,
      tag: values.tag,
      type: values.type,
      transaction_date: values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
      target: targetAmount
    };
    console.log(newData)
    setSavingData([...savingData, newData]);
    setIsSavingModal(false);
    
    const token = localStorage.getItem("token");
    fetch("/api/saving/saving", {
      method: "POST",
      headers: {
        token: `${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newData)
    }).then(response => {
      if (response.ok) {
        fetchData();
        message.success("Added SuccessFully")
      } else {
        message.error('Failed to add saving');
      }
    });
  };

  const columns = [
    { title: "No", key: "key",  render: (text, record, index) => {
      const { currentPage, pageSize } = paginationData;
      return (currentPage - 1) * pageSize + index + 1; // Calculate the row number
    }, },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'transaction_date', key: 'transaction_date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Target', dataIndex: 'target', key: 'target'},
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/*<EditOutlined onClick={() => handleUpdate(record)} style={{ color: 'blue', cursor: 'pointer' }} />*/}
          <DeleteOutlined onClick={() => handleDelete(record)} style={{ color: 'red', cursor: 'pointer' }} />
        </Space>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/update")}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

  const toggleSidebar = () => setCollapsed(!collapsed);


  //for unique record
  const getUniqueTransactions = (transactions) => {
    const uniqueMap = new Map();
  
    transactions.forEach(transaction => {
      const key = `${transaction.amount}-${transaction.transaction_date}`; // Create unique key
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, transaction); // Store unique 
      }
    });
  
    return Array.from(uniqueMap.values()); // Return unique transactions
  };

  const handleTargetChange = () => {
    if (!targetMonth) {
      message.error("Please select a target month!");
      return;
    }
    if (isNaN(newTarget) || newTarget < 0) {
      message.error("Please enter a valid target amount!");
      return;
    }
  
    const targetData = { amount: newTarget, month: targetMonth };
    setTargetAmount(newTarget);
    localStorage.setItem("savingsTarget", JSON.stringify(targetData));
    setIsTargetModalVisible(false);
    message.success("Target updated!");
  
    // Fetch all saving data to update the target for the specified month
    const token = localStorage.getItem("token");
    fetch("/api/saving/saving", {
      method: "GET",
      headers: { token: `${token}` }
    })
      .then(response => response.json())
      .then(data => {
        // Update transactions and calculate status
        const updatedTransactions = data.map(item => {
          const itemMonth = item.transaction_date.split("-")[1]; // Get month from date
  
          // Calculate total savings for the month
          const totalSavingsForMonth = data
            .filter(transaction => transaction.transaction_date.startsWith(itemMonth))
            .reduce((acc, curr) => acc + curr.amount, 0) + (itemMonth === targetMonth.split("-")[1] ? newTarget : 0);
  
          // Determine the status based on the updated target
          const status = totalSavingsForMonth >= newTarget ? 'Achieved' : 'In Progress';
  
          // If the transaction is in the target month, update the target and status
          if (itemMonth === targetMonth.split("-")[1]) {
            return { ...item, target: newTarget, status }; // Update target and status
          }
          // Ensure that we return the item with the updated status
          return { ...item, status }; // Return unchanged item with updated status
        });
        const uniqueUpdatedData = getUniqueTransactions(updatedTransactions);
        setSavingData(uniqueUpdatedData);
  
        // Now send  updated transactions back to server
        return Promise.all(updatedTransactions.map(item => {
          return fetch(`/api/saving/saving/${item.id}`, {
            method: "PUT",
            headers: {
              token: `${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...item, target: item.target }) // Update with new target
          });
        }));
      })
      .then(() => {
        message.success("All transactions for the selected month have been updated successfully!");
      })
      .catch(error => {
        console.error("Error updating transactions:", error);
        message.error("Failed to update transactions.");
      });
  };


  let normalizedTransactions = Array.isArray(savingData)
  ? savingData
      .filter((item) => item !== undefined && item !== null) // Filter undefined entries
      .map((item) => {
        // If object is nested 
        if (item[0]) {
          return item[0];
        }
        return item; 
      })
  : [];

const formatDate=(dateString)=>{
  const date = new Date(dateString);
  if(!isNaN(date.getTime())){
  return date.toISOString().split('T')[0];
  }
  return null;
}

// Filtering
  let filters = normalizedTransactions.filter((item) => {
  if(!item.transaction_date) return false;
  const transactionDate  = formatDate(item.transaction_date);
  if(!transactionDate) return false;
  const transactionMonth = new Date(item.transaction_date).toLocaleString('default', { month: 'long' });
  return (
    item.tag &&
    item.tag.toLowerCase().includes(search.toLowerCase()) &&
    (monthFilter === "" || monthFilter === undefined || transactionMonth.toLowerCase() === monthFilter.toLowerCase())
  );
  });

  filters.forEach((item)=>{
    item.formattedDate = formatDate(item.transaction_date);
  })

// Sorting 
  let sorted = filters.sort((a, b) => {
    if (sortKey === "date") return new Date(a.transaction_date) - new Date(b.transaction_date);
    else if (sortKey === "amount") return parseFloat(a.amount) - parseFloat(b.amount);
    else return 0; // No sorting case
  });

// export 
  function exportToCsv() {
    const csv = unparse(sorted, {
      fields: ["id", "user_id", "amount", "tag", "type", "transaction_date", "created_at"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Savings.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className='maindiv'>
      <Sidebar collapsed={collapsed} onCollapseChange={toggleSidebar} />
      <div className='content'>
       <Heads toggleSidebar={toggleSidebar} collapsed={collapsed} setCollapsed={setCollapsed} name={name}/>

        

        <Card className='cards'>
          <div className='card-div'>
            <h2>Total Savings</h2>
            
            <Button type="primary" onClick={() => setIsTargetModalVisible(true)} className='btns'>Set Target</Button>
          </div>
        </Card>

      <div className='main-Table' >
        <div className="inside-table">
          <Select
            className="select-input"
            style={{width:"120px"}}
            onChange={(value) => setMonthFilter(value)} // Set selected month
            value={monthFilter} // selected value
            placeholder="Filter by Month"
            allowClear
          >
          <Option value="">All</Option>
          <Option value="January">January</Option>
          <Option value="February">February</Option>
          <Option value="March">March</Option>
          <Option value="April">April</Option>
          <Option value="May">May</Option>
          <Option value="June">June</Option>
          <Option value="July">July</Option>
          <Option value="August">August</Option>
          <Option value="September">September</Option>
          <Option value="October">October</Option>
          <Option value="November">November</Option>
          <Option value="December">December</Option>
         </Select>
        
          <h2>Transactions</h2>
          <button className="btns" onClick={exportToCsv}>Export to CSV</button>  
          </div>
          <Table scroll={{ x: 'max-content' }} 
          columns={columns} dataSource={filters} 
           pagination={{
            current: paginationData.currentPage,
            pageSize: paginationData.pageSize,
            total: filters.length,
            showSizeChanger: true, 
            pageSizeOptions: Array.from({length: 50}, (_, i) => (i + 1).toString()),
            onChange: (page, pageSize) => {
              setPaginationData({
                ...paginationData,
                currentPage: page,
                pageSize: pageSize,
              });
            },
          }}  />
        </div>

        <AddSavingModal
          isSavingModalVisible={isSavingModal}
          handleSavingCancel={handleSavingCancel}
          onFinish={onFinish}
          isEditMode={isEditMode}
          selectedRecord={selectedRecord}
        />

        <Modal
          title="Set Your Monthly Savings Target"
          visible={isTargetModalVisible}
          onOk={handleTargetChange}
          onCancel={() => setIsTargetModalVisible(false)}
        >
        <Input 
          type="number" 
          value={newTarget} 
          onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value) && value >= 0) {
            setNewTarget(value);
          } 
          else {
          setNewTarget(0); // or handle it in another way
          } 
        }} 
         placeholder="Enter target amount" 
        />       
        <DatePicker picker="month" onChange={(date, dateString) => setTargetMonth(dateString)} placeholder="Select target month" style={{ marginTop: '1rem' }} />
        </Modal>
      </div>
    </div>
  );
};

export default TotalSavings;