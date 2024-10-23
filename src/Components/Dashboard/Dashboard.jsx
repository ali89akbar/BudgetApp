import React, {useEffect, useState} from 'react'
import Cards from './Card'
import { message, Modal } from 'antd'
import AddExpenseModal from '../Modals/addExpense.jsx'
import AddIncomeModal from '../Modals/addIncome.jsx'
import Tables from '../Dashboard/Transaction table/Table.jsx';

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined,DownOutlined } from '@ant-design/icons';

import { Layout, Avatar, Menu, Dropdown, Button } from 'antd';
import Sidebar from './Sidebar/Sidebar.jsx'
import PieChart from './Chart/PieChart.jsx'
import NoTransactions from './No Transactions/NoTransactions.jsx'
import BarChart from './Chart/Bargraph.jsx'
import Income from './Pages/Income.jsx'
import { Navigate, useNavigate } from 'react-router-dom'
import Login from '../Login/SignUp/Login.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import Heads from './Header/Heads.jsx'
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [groupedDataByMonth, setGroupedDataByMonth] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [isExpenseModal,setIsExpenseModal] = useState(false)
  const [isIncomeModal,setisIncomeModal]   = useState(false)
  const [Income,setIncome]   = useState(0)
  const [name,setName]   = useState("");
  const [expense,setExpense] = useState(0)
  const [saving,setSaving]   = useState(0)
  const [currentPage,setCurrentPage]  = useState(1)
  const [total,setTotal] = useState(100)
  const [error,setError] = useState("")
  const {logout} = useAuth();
  const {user}   = useAuth();
  const [graph,setGraph]= useState();
  const [transaction,setTransaction]  = useState()
  const navigate = useNavigate();
  const [pagination,setPagination] = useState({
    current  : 1,
    pageSize : 10,
    total    : 0,
  })

  const limit = 10;
  let barChartData;
  let pieChartData;

  const fetchData = async (page=1, pageSize=10)=>{
    const token = localStorage.getItem("token")
    const response = await fetch(`/api/dashboard/dashboard?page=${page}&limit=${pageSize}`,{
      method:'GET',
      headers:{
        token:`${token}`
      }
    })
    if(!response.ok){
      console.log("Response not found")

    }
    const data = await response.json();
    setIncome(data.incomeamount)
    setExpense(data.expenseamount)
    setSaving(data.savingamount)

    if(data.message && data.message !== "You have currently no transactions"){
      message.error(data.message)
      setError(data.message)
    }
    else if(data.message === "You have currently no transactions")
      {
        setError(data.message)
        message.info(data.message)
      }
    setPagination({
      current: data.currentPage,
      pageSize: pageSize,
      total: data.totalRecords,
    })

//  month name and year
  const getMonthYearName = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];  //  month name
    const year = date.getFullYear();
    return `${month} ${year}`;  // Format 
};

if(data.message !== "You have currently no transactions"){

// Step 1: Map data
const transactions = Object.entries(data.data).map(([key, value]) => {
  return {
    key: key,
    ...value,
  };
});

setTransaction(transactions)

// Step 2: Group by month name year, and sum income and expense
 const groupedDataByMonths = transactions.reduce((acc, { amount, type, transaction_date }) => {
  const monthYear = getMonthYearName(transaction_date);

  // If monthYear not their
  if (!acc[monthYear]) {
    acc[monthYear] = { income: 0, expense: 0 }; // income and expense
  }

  // Sum the income or expense for the month
  if (type === "income") {
    acc[monthYear].income += parseFloat(amount);
  } else if (type === "expense") {
    acc[monthYear].expense += parseFloat(amount);
  }

  return acc;

}, {});

// Step 3: Convert groupedDataByMonth into arrays
 barChartData = Object.entries(groupedDataByMonth).map(([month, { income, expense }]) => ({
  month,
  income,
  expense
}));

const totalIncome = barChartData.reduce((acc, { income }) => acc + income, 0);
const totalExpense = barChartData.reduce((acc, { expense }) => acc + expense, 0);

 pieChartData = [
  { name: "Income", value: totalIncome },
  { name: "Expense", value: totalExpense }
];

}
}

const fetchGraphData = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/dashboard/all`, {
      method: 'GET',
      headers: {
          token: `${token}`,
      },
  });

  if (!response.ok) {
      console.log("Response not found");
      return;
  }

  const data = await response.json();
  const getMonthYearName = (dateString) => {
const date = new Date(dateString);
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const month = monthNames[date.getMonth()];  //  month name
const year = date.getFullYear();
return `${month} ${year}`;  // Format 
};

  if(data.message !== "You have currently no transactions"){

// Step 1: Map data
const transactions = Object.entries(data.data).map(([key, value]) => {
return {
  key: key,
  ...value,
};
});
setGraph(transactions)

// Step 2: Group by month name year, and sum income and expense
const groupedDataByMonths = transactions.reduce((acc, { amount, type, transaction_date }) => {
const monthYear = getMonthYearName(transaction_date);

// If monthYear not their
if (!acc[monthYear]) {
  acc[monthYear] = { income: 0, expense: 0 }; // income and expense
}

// Sum the income or expense for the month
if (type === "income") {
  acc[monthYear].income += parseFloat(amount);
} else if (type === "expense") {
  acc[monthYear].expense += parseFloat(amount);
}

return acc;

}, {});
setGroupedDataByMonth(groupedDataByMonths)

} 
};

  useEffect(()=>{
    fetchData()
    fetchGraphData()
  },[])

  const showExpenseModal=()=>{
      setIsExpenseModal(true);
  }
  const showIncomeModal=()=>{
      setisIncomeModal(true);
  }
  const handleExpense=()=>{
      setIsExpenseModal(false)
  }
  const handleIncome=()=>{
      setisIncomeModal(false)
  }

  const onFinish=(values,type)=>{
      console.log("Finish",values,type)
  }
  
  useEffect(()=>{
  setName(user?.user?.name.toUpperCase())
  },[name])

  const toggleSidebar = () => {
      setCollapsed(!collapsed);  // Toggle the collapsed state
    };
  
  const menu = (
    <Menu>
        <Menu.Item key="1" onClick={() => navigate("/update")}>Edit Profile</Menu.Item>
        <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
    );

return (
  <div style={{ display: 'flex', width: '100%' }}>
  <Sidebar collapsed={collapsed} onCollapseChange={toggleSidebar} />
  <div className="content"> 
    <Heads toggleSidebar={toggleSidebar} collapsed={collapsed} setCollapsed={setCollapsed} name={name}/>
    <Cards
      Income={Income}
      expense={expense}
      saving={saving}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
    />
    {error === "You have currently no transactions" || error === "ID is missing" ?  <NoTransactions /> : <BarChart sorted={groupedDataByMonth} pieChartData={graph}/>}
 
    <AddExpenseModal
      isExpenseModalVisible={isExpenseModal}
      handleExpenseCancel={handleExpense}
      onFinish={onFinish}
    />
    <AddIncomeModal
      isIncomeModalVisible={isIncomeModal}
      handleIncomeCancel={handleIncome}
      onFinish={onFinish}
    />
    <Tables transactions={transaction} pagination={pagination} setPagination={setPagination} fetchData={fetchData}/>
  </div>
</div>

  );
};

export default Dashboard;

