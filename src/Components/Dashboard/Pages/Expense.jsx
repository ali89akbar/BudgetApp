import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, message, Progress, Menu, Layout, Dropdown,Avatar, Radio, Select } from 'antd';
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
import { useNavigate } from 'react-router-dom';
import { unparse } from 'papaparse';
import Heads from './../Header/Heads'

const ExpenseScreen = () => {
  const [isExpenseModal, setIsExpenseModal] = useState(false);
  const [expenseData, setExpenseData]       = useState([]);
  const [collapsed, setCollapsed]           = useState(false);
  const [isEditMode,setIsEditMode]          = useState(false);
  const [selectedRecord,setSelectedRecord]  = useState(null);
  const [name, setName]                     = useState("")
  const {logout}                            = useAuth();
  const {user}                              = useAuth();
  const [sortKey,setSortKey] = useState("");
  const [search,setSearch]=useState("");
  const [monthFilter,setMonthFilter]= useState("")
  const [amountFilter, setAmountFilter] = useState(""); 
  const [dateFilter, setDateFilter] = useState(""); 
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages : 0,
    pageSize   : 10, // Default page size
  });
  const navigate = useNavigate()
 


//get
const fetchData = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/api/expense/expense?page=${page}&limit=${limit}`, {
      method  : "GET",
      headers : {
      token   : `${token}`,
      },
    });

    if (!response.ok) {
      console.log("Response not found");
      return;
    }

    const data = await response.json();

    setExpenseData(data.expenses); // Paginated expense data
    setPaginationData({
      currentPage : data.currentPage,
      totalPages  : data.totalPages,
      pageSize    : limit,
    });
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
};

// initially and on pagination change
useEffect(() => {
  fetchData(paginationData.currentPage, paginationData.pageSize);
}, []);

const handleTableChange = (pagination) => {
  fetchData(pagination.current, pagination.pageSize);
};

useEffect(()=>{
    setName(user?.user?.name.toUpperCase())
    fetchData()
  },[name])


//Delete
  const handleDelete=async(record)=>{
    const token = localStorage.getItem('token');
    try{
    const response =  await fetch(`/api/expense/expense/${record.id}`,{
      method  :' DELETE',
      headers :  { 
      token   :` ${token}`
      }
    })

    if(!response.ok){
      console.log("Error while deleting");
    }
    setExpenseData(expenseData.filter(item => item.id !== record.id))
    message.success("Expense Deleted Successfully")

  }catch(error){
    console.error("Error:", error);
    message.error("Error while deleting expense")
  }
    
  }
 

  const handleUpdate = (record) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setIsExpenseModal(true); 
  };

  const showExpenseModal = () => {
    setIsEditMode(false);
    setIsExpenseModal(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModal(false);
    setSelectedRecord(null); 
  };

  const onFinish = (values) => {
    const newData = {
      key   : Date.now().toString(),
      Name  : values.name,
      amount: values.amount,
      tag   : values.tag,
      type  : values.type,
      date  : values.date ? values.date.format('YYYY-MM-DD') : '2024-09-25',
    };

    setExpenseData([...expenseData, newData]);
    message.success('Expense added successfully');
    setIsExpenseModal(false);
  };

  const columns = [
    { title: 'No',
      key: 'key',
      render: (text, record, index) => {
        const { currentPage, pageSize } = paginationData;
        return (currentPage - 1) * pageSize + index + 1; // Calculate the row number
      },},
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
      <Menu.Item key="1" onClick={() => navigate("/update")}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
  );

  const toggleSidebar = () => {
    setCollapsed(!collapsed);  // Toggle the collapsed state
  };

  let normalizedTransactions = Array.isArray(expenseData)
  ? expenseData
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
  link.download = "expense.csv";
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
        <h2>Total Expense</h2>
        <Button type = "primary" onClick={showExpenseModal} className='btns'>
            Add Expense
        </Button>
    </div>
</Card>



  <div  className='main-Table'>
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
      <button className="btns" onClick={exportToCsv}>
              Export to CSV
      </button>
         
          </div>
     <Table
      scroll  = {{ x: 'max-content' }}
      columns = {columns} 
      dataSource = {filters}
      pagination={{
        current  : paginationData.currentPage,
        total    : paginationData.totalPages * paginationData.pageSize,
        pageSize : paginationData.pageSize,
        showSizeChanger: true, 
        pageSizeOptions: Array.from({length: 50}, (_, i) => (i + 1).toString()), // options for page size
      }}
      onChange = {handleTableChange}
    /> 
      </div>
      </div>
     
    
      {/* Expense Modal */}
      <AddExpenseModal
        isExpenseModalVisible   = {isExpenseModal}
        handleExpenseCancel     = {handleExpenseCancel}
        onFinish                = {onFinish}
        expenseData             = {expenseData}
        setExpenseData          = {setExpenseData}
        selectedRecord          = {selectedRecord}
        isEditMode              = {isEditMode}
        fetchData               = {fetchData}
      />
    </div>
  );
};

export default ExpenseScreen;
