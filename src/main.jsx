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

const router= createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignInForm />} />
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/chart' element={<PieChart/>}/>
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
