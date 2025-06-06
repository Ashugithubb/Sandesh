
import './App.css'
import { Login } from './component/Login_Page'
import { Routes,Route } from 'react-router-dom'
function App() {
  

  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    
     </Routes>
    </>
  )
}

export default App
