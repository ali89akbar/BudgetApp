import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress, Layout, Dropdown, Avatar, Menu, Select } from 'antd';
import { EditOutlined, DeleteOutlined,MenuFoldOutlined,UserOutlined,MenuUnfoldOutlined } from '@ant-design/icons';
import AddIncomeModal from '../../Modals/addIncome';
import Sidebar from '../Sidebar/Sidebar';
import './pages.css';
import '../Chart/Chart.css'
import '../card.css'
import { Pie, Bar } from '@ant-design/charts';
import { Header } from 'antd/es/layout/layout';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { unparse } from 'papaparse';
import Heads from '../Header/Heads';


const IncomeScreen = () => {
  const [isIncomeModal, setIsIncomeModal]   = useState(false);
  const [incomeData, setIncomeData]         = useState([]);
  const [collapsed, setCollapsed]           = useState(false);
  const [selectedRecord,setSelectedRecord]  = useState(null);
  const [isEditMode,setIsEditMode]          = useState(false);
  const [monthFilter,setMonthFilter]        = useState("")
  const [sortKey,setSortKey] = useState("");
  const [search,setSearch]=useState("");
  const [amountFilter, setAmountFilter] = useState(""); 
  const [dateFilter, setDateFilter] = useState(""); 
  const [paginationData, setPaginationData] = useState({
    currentPage : 1,
    totalPages  : 0,
    pageSize    : 10, // Default page size
  });
  const [loading, setLoading]  = useState(false);
  const navigate  = useNavigate()
  const [name,setName] = useState("")
  const {logout} = useAuth();
  const {user}   = useAuth();


  useEffect(()=>{
    setName(user?.user?.name.toUpperCase())
    fetchData()
  },[name])
  const fetchData = async (page = 1, limit = 10) => {
    const token = localStorage.getItem('token');
    setLoading(true); 
    try {
      const response = await fetch(`/api/income/views?page=${page}&limit=${limit}`, {
        method  : 'GET',
        headers : {
        token   : `${token}`,
        },
      });

      if (!response.ok) {
        message.error("Response Not Found")
        return;
      }

      const data  = await response.json();
      setIncomeData(data.income);
      setPaginationData({
        currentPage  : data.currentPage,
        totalPages   : data.totalPages,
        pageSize     : limit,
      });
    } catch (error) {
      console.log('Error fetching data:', error);
      message.error("Error While Fetching Income:" , error)
    } finally {
      setLoading(false); 
    }
  };

  // Fetch 
  useEffect(() => {
    fetchData(paginationData.currentPage, paginationData.pageSize);
  }, []);

  // Handle pagination 
  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };
 
  //Delete 
  const handleDelete = async (record) => {
    const token = localStorage.getItem("token")
    try{
      const response =  await fetch(`/api/income/deletes/${record.id}`,{
        method  :"DELETE",
        headers :{ 
        token   :` ${token}`
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
      message.error("Error While Deleting Record: " + error)
    }
  };

  //Update
  const handleUpdate = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setIsIncomeModal(true)
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/update")}>Edit Profile</Menu.Item>
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

  const onFinish  = (values) => {
    const newData = {
      key         : Date.now().toString(), 
      Name        : values.name,
      amount      : values.amount,
      tag         : values.tag,
      type        : values.type,
      date        : values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };
    setIncomeData([...incomeData, newData]); 
    message.success('Income added successfully');
    setIsIncomeModal(false); 
  };

  // Table columns 
  const columns = [
    { title: 'No',
      key: 'key',
      render: (text, record, index) => {
        const { currentPage, pageSize } = paginationData;
        return (currentPage - 1) * pageSize + index + 1; // Calculate the row number
      },},
    { title: 'Name', dataIndex: 'tag', key: 'tag' },
    { title: 'Amount',dataIndex: 'amount', key: 'amount' },
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


  let normalizedTransactions = Array.isArray(incomeData)
  ? incomeData
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
  link.download = "Income.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  return (
    <div className = 'maindiv'>        
    <Sidebar collapsed = {collapsed} onCollapseChange={toggleSidebar}  />
     <div className = 'content'>
     <Heads toggleSidebar={toggleSidebar} collapsed={collapsed} setCollapsed={setCollapsed} name={name} />



     <Card className = 'cards'>
      <div className = 'card-div'>
        <h2>Total Income</h2>
          <Button type = "primary" onClick={showIncomeModal} className='btns'>
            Add Income
          </Button>
       </div>
     </Card>

    <div className='main-Table'>
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
    <Table
      scroll   = {{ x: 'max-content' }}
      columns  = {columns}
      dataSource = {filters}
      pagination = {{
        current  : paginationData.currentPage,
        total    : paginationData.totalPages * paginationData.pageSize,
        pageSize : paginationData.pageSize,
        showSizeChanger: true, 
        pageSizeOptions: Array.from({length: 50}, (_, i) => (i + 1).toString()), 
      }}
      loading  = {loading} 
      onChange = {handleTableChange}
    />
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
