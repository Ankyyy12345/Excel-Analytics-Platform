import './App.css'
import { Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/login'
import Dashboard from './components/Dashboard'
import PrivateRoute from './PrivateRoute'
function App() {
return(
  <div>
    <Routes>
      <Route path='/' element={< Signup />} />
      <Route path='/login' element={< Login />} />
      <Route path='/dashboard' element={
        <PrivateRoute>
          < Dashboard /> 
        </PrivateRoute>
        }
         />
    </Routes>
  </div>
)
}

export default App
