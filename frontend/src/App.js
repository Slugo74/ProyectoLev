import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList'
import AreaList from './components/AreaList';
import EmployeeForm from './components/EmployeeForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/employees' element={<EmployeeList />} />
          <Route path='/create-employee' element={<EmployeeForm />} />
          <Route path='/areas' element={<AreaList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
