
import './App.css'
import { Login } from './component/Login_Page'
import { ChatApp } from './component/ChatApp'
import { Routes,Route,Navigate } from 'react-router-dom'
import ProtectedRoutes from './utils/ProtectedRoutes'
import { SignUp } from './component/SignUp_Page'

function App() {
  

  return (
    <>
    <Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp/>} />
  <Route element={<ProtectedRoutes />}>
    <Route path="/home" element={<ChatApp />} />
  </Route>
</Routes>
    </>
  )
}

export default App
