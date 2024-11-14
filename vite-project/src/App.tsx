import './App.css'
import Login from "./components/loginComp/loginComp";
import { Route, Routes } from "react-router-dom";
import Register from "./components/registerComp/registerComp";
import DashboardAttack from './components/dashboredAttackComp/dashboredAttackComp';
import DashboardDefence from './components/dashboredDefanceComp/dashboredDefanceComp';

function App() {

  return (
   
    <div>
    <Routes>
      <Route path="/dashboardAttack" element={<DashboardAttack />} />
      <Route path="/dashboardDefance" element={<DashboardDefence />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={< Register/>} />
    </Routes>

      
    </div>
  )
}

export default App
