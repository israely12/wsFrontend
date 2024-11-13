import './App.css'
import Login from "./components/loginComp/loginComp";
import { Route, Routes } from "react-router-dom";
import Register from "./components/registerComp/registerComp";

function App() {

  return (
   
    <div>
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={< Register/>} />
    </Routes>

      
    </div>
  )
}

export default App
