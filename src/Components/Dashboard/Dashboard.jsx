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
import { useNavigate } from 'react-router-dom'
import Login from '../Login/SignUp/Login.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [groupedDataByMonth, setGroupedDataByMonth] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [isExpenseModal,setIsExpenseModal]=useState(false)
  const [isIncomeModal,setisIncomeModal]= useState(false)
  const [Income,setIncome]= useState(0)
  const [name,setName] = useState("");
  const [expense,setExpense]= useState(0)
  const [saving,setSaving]= useState(0)
  const [currentPage,setCurrentPage]=useState(1)
  const [total,setTotal]= useState(100)
  const {logout} = useAuth();
  const {user}= useAuth();
 
//  const navigate = useNavigate();
console.log("Dashboard user"+ user?.user?.name)

  let transactions = [
      {
        name: "Freelance Payment",
        amount: 500,
        tag: "freelance",
        type: "income",
        date: "2024-09-01",
      },
      {
        name: "Salary",
        amount: 1500,
        tag: "salary",
        type: "income",
        date: "2024-09-05",
      },
      {
        name:"Investment of property",
        amount: 5000,
        tag:"property",
        type:"income",
        date:"2024-08-09"
      },
      {
        name: "Investment Profit",
        amount: 300,
        tag: "investment",
        type: "income",
        date: "2024-09-10",
      },
      {
        name: "Grocery Shopping",
        amount: 100,
        tag: "food",
        type: "expense",
        date: "2024-09-03",
      },
      {
        name: "Tuition Fee",
        amount: 200,
        tag: "education",
        type: "expense",
        date: "2024-07-06",
      },
      {
        name: "Office Supplies",
        amount: 75,
        tag: "office",
        type: "expense",
        date: "2024-08-07",
      },
    ];

    const limit = 10;
   {/* const fetchData = async(page=1)=>{
      try{
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/dashboard/dashboard?page=${page}`,{
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
            token: `${token}`,
          },
        });

        if(!response.ok){
          throw new Error('Failed to fetch data')
        }

        const data = await response.json();
        //setCurrentPage(page)
       // setIncome(data.income)
        //setExpense(data.expense)
        //setTotal(Income-expense)
        //setTotal(data.totalTransactions)
        console.log(data)
        console.log(data.data)
      }
      catch(error){
        console.error("Error fetching data",error)
      }
    }
  */}
let barChartData;
let pieChartData;
  const fetchData = async ()=>{
    const token = localStorage.getItem("token")
  
    const response = await fetch("/api/dashboard/dashboard",{
      method:'GET',
      headers:{
        token:`${token}`
      }
    })
    if(!response.ok){
      console.log("Response not found")

    }
    const data = await response.json();
    console.log("this is dashboard data" + data.data)
    
    setIncome(data.incomeamount)
    setExpense(data.expenseamount)
    setSaving(data.savingamount)
    if(data.message){
      message.error(data.message)
    }

// Function to get the month name and year from the date
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

// Step 1: Map over data 
const transactions = Object.entries(data.data).map(([key, value]) => {
  return {
    key: key,
    ...value, // Spread the value 
  };
});

// Step 2: Group transactions by month name and year, and sum income and expense
 const groupedDataByMonths = transactions.reduce((acc, { amount, type, transaction_date }) => {
  const monthYear = getMonthYearName(transaction_date);

  // If monthYear is not already in the accumulator, initialize it
  if (!acc[monthYear]) {
    acc[monthYear] = { income: 0, expense: 0 }; // Initialize both income and expense
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
// Step 3: Convert groupedDataByMonth into arrays for BarChart and PieChart
 barChartData = Object.entries(groupedDataByMonth).map(([month, { income, expense }]) => ({
  month,
  income,
  expense
}));

// Prepare PieChart data (total income vs. total expense)
const totalIncome = barChartData.reduce((acc, { income }) => acc + income, 0);
const totalExpense = barChartData.reduce((acc, { expense }) => acc + expense, 0);

 pieChartData = [
  { name: "Income", value: totalIncome },
  { name: "Expense", value: totalExpense }
];

// Output the results
console.log("Bar Chart Data:", barChartData); // Data for BarChart
console.log("Pie Chart Data:", pieChartData);  // Data for PieChart (total income vs. total expense)
}

console.log(groupedDataByMonth)

  useEffect(()=>{
    fetchData()
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

  function calculateBalance(){
      let incomeTotal = 0;
      let expenseTotal=0;

      transactions.forEach((transaction)=>{
          if (transaction.type === "income"){
              incomeTotal+= transaction.amount
          } else {
              expenseTotal+= transaction.amount
          }
  })
  setIncome(incomeTotal)
  setExpense(expenseTotal)
  setTotal(incomeTotal-expenseTotal)
  }

 
    
    // Adding a new transaction example:
    const addTransaction = (name, amount, tag, type, date) => {
      const newTransaction = { name, amount, tag, type, date };
      transactions.push(newTransaction);
    };
    
    // Example of adding a new expense
    addTransaction("Restaurant Bill", 50, "food", "expense", "2024-09-20");
    
    // Example of adding a new income
    addTransaction("Project Payment", 700, "freelance", "income", "2024-09-21");
    
    console.log(transactions);
    
    const toggleSidebar = () => {
      setCollapsed(!collapsed);  // Toggle the collapsed state
    };
  
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => console.log('Edit Profile clicked')}>Edit Profile</Menu.Item>
        <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
      </Menu>
    );
    
let sorted = transactions.sort((a,b)=>{
  return new Date(a.date) - new Date(b.date);
})

return (
  <div style={{ display: 'flex', width: '100%' }}>
  <Sidebar collapsed={collapsed} onCollapseChange={toggleSidebar} />
  <div className="content">
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
    <Cards
      Income={Income}
      expense={expense}
      saving={saving}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
    />
    {console.log("BY MONTH FILETERED "+groupedDataByMonth)}
    {transactions.length !== 0 ? <BarChart sorted={groupedDataByMonth} /> : <NoTransactions />}
    
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
    <Tables transactions={transactions} />
  </div>
</div>

  );
};

export default Dashboard;


