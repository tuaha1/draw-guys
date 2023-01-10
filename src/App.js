import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Pages/Main"
import Menu from "./Pages/Menu"

function App() {
  return <Router>
    <Routes>
      <Route path='/' element={<Menu />}></Route>
      <Route path='/main' element={<Main />}></Route>
    </Routes>
  </Router >
}

export default App; 