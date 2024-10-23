
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/SignUp/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/PrivateRoutes/PrivateRoutes'
import PieChart from './Components/Dashboard/Chart/PieChart'
import IncomeScreen from './Components/Dashboard/Pages/Income'
import ExpenseScreen from './Components/Dashboard/Pages/Expense'
import TotalSavings from './Components/Dashboard/Pages/TotalSavings'

import Forget from './Components/Login/SignUp/Forget'
import Heads from './Components/Dashboard/Header/Heads'
import ResetPassword from './Components/Login/SignUp/ResetPassword'
import UpdateUser from './Components/UserUpdate/UpdateUser'
function App() {
  
  return (
    <Router>
      <AuthProvider>
        {" "}
        <Routes>
          <Route element={<ProtectedRoute/>}>
          {" "}
          <Route element={<Heads/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/chart' element={<PieChart/>}/>
    <Route path='/income' element={<IncomeScreen/>}/>
    <Route path='/expense' element={<ExpenseScreen/>}/>
    <Route path='/savings' element={<TotalSavings/>}/>
    <Route path='/update' element={<UpdateUser/>}/>
          </Route>
          <Route path='/' element={<Login/>}/>
          <Route path='/forget' element={<Forget/>}/>
          <Route path='reset-password' element={<ResetPassword/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  
  )
}

export default App
