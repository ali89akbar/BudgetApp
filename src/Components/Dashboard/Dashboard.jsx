import React, {useEffect, useState} from 'react'
import Cards from './Card'
import { Modal } from 'antd'
import AddExpenseModal from '../Modals/addExpense.jsx'
import AddIncomeModal from '../Modals/addIncome.jsx'
import Tables from '../Dashboard/Transaction table/Table.jsx';

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Sidebar from './Sidebar/Sidebar.jsx'
import PieChart from './Chart/PieChart.jsx'
import NoTransactions from './No Transactions/NoTransactions.jsx'
import BarChart from './Chart/Bargraph.jsx'
import Income from './Pages/Income.jsx'
const { Header, Content, Footer, Sider } = Layout;


const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isExpenseModal,setIsExpenseModal]=useState(false)
  const [isIncomeModal,setisIncomeModal]= useState(false)
  const [Income,setIncome]= useState(100)

  const [expense,setExpense]= useState(100)
  //const [saving,setSaving]= useState(0)
  const [total,setTotal]= useState(100)
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

  },[transactions])

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
    
  const handleCollapseChange = (value) => {
    setCollapsed(value);
  };

  const contentStyle = {
    marginLeft: collapsed ? '50px' : '80px', // Adjust margin based on sidebar's width
    transition: 'margin-left 0.3s ease' // Smooth transition
  //'@media (max-width: 768px)': {
    //marginLeft: collapsed ? '30px' : '50px',
    //transition: 'margin-left 0.3s ease', // Smooth transition
    // Adjust margin for smaller screens
  }



let sorted = transactions.sort((a,b)=>{
  return new Date(a.date) - new Date(b.date);
})

return (
    <div className='mains' style={{direction:"flex"}}>
      <Sidebar onCollapseChange={handleCollapseChange} contentStyle={contentStyle} />
      <div className="content" style={contentStyle} >
        <Cards
          Income={Income}
          expense={expense}
          total={total}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
          contentStyle={contentStyle}
       />
        
        {transactions.length != 0 ? <BarChart sorted={sorted} 
        contentStyle={contentStyle}
        handleCollapseChange={handleCollapseChange}/>: <NoTransactions/>}
        
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
        <Tables 
         contentStyle={contentStyle} 
         transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;


