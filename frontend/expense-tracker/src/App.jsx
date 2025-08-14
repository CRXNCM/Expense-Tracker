import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DailyLog from './pages/Dashboard/DailyLog';
import MealPlan from './pages/Dashboard/MealPlan';
import UserProfile from './pages/Dashboard/UserProfile';
import Note from './pages/Dashboard/Note';
import Settings from './pages/Dashboard/Settings';
import FixedEx from './pages/Dashboard/FixedEx';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import EndpointTotalsTestPage from './pages/Test/EndpointTotalsTestPage';

import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <div>
          <Router>
            <Routes>
              <Route path='/userprofile' element={<UserProfile/>} />
              <Route path='/' element={<Root/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/dashboard' exact element={<Home />} />
              <Route path='/income' exact element={<Income />} />
              <Route path='/expense' exact element={<Expense />} />
              <Route path='/mealplan' exact element={<MealPlan />} />
              <Route path='/note' exact element={<Note />} />
              <Route path='/dailylog' exact element={<DailyLog />} />
              <Route path='/fixedex' exact element={<FixedEx />} />
              <Route path='/settings' exact element={<Settings />} />
              <Route path='/admin' exact element={<AdminDashboard />} />
              <Route path='/test/endpoint-totals' exact element={<EndpointTotalsTestPage />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isLoggedIn = localStorage.getItem('token');
  return isLoggedIn ? <Navigate to='/dashboard' /> : <Navigate to='/login' />;
};
