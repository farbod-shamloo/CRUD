import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserList from "./pages/UserList"
import CreateUser from "./pages/CreateUser"
import Table from "./components/Table"


function App() {


  return (
    <Router>
     <Routes>
      <Route path="/" element={<Table />}/>
      <Route path="create" element={<CreateUser />}/>
     </Routes>
    </Router>
  )
}

export default App
