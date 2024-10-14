import React from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Login from './Login/SignUp/Login'

const Printing=()=>{
    const { login } = useAuth()
    console.log(login)

    return (
        <div>
            
        </div>
    )
}
const Test = () => {
  return (
    <div>
      <AuthProvider>
        <Printing />
        
      </AuthProvider>
    </div>
  )
}

export default Test
