import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './Components/Login/SignUp/Login.jsx'
import SignUpForm from './Components/Login/SignUp/SignUp.jsx'
import SignInForm from './Components/Login/SignUp/SignIn.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import PieChart from './Components/Dashboard/Chart/PieChart.jsx'
import Income from './Components/Dashboard/Pages/Income.jsx'
import ExpenseScreen from './Components/Dashboard/Pages/Expense.jsx'
import TotalSavings from './Components/Dashboard/Pages/TotalSavings.jsx'
import Forget from './Components/Login/SignUp/Forget.jsx'
import ProtectedRoute from './Components/PrivateRoutes/PrivateRoutes.jsx'
import Test from './Components/Test.jsx';
import { AuthProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
<App/>
  </StrictMode>,
)

