
import './App.css'
import { Login } from './component/Login_Page'
import { ChatApp } from './component/Home'
import { Routes,Route } from 'react-router-dom'
function App() {
  

  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={<ChatApp/>}/>
     </Routes>
    </>
  )
}

export default App
