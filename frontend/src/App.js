import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import RestaurantPrivateRoute from './restaurants/utils/RestaurantPrivateRoute'
import { RestaurantAuthProvider } from './restaurants/context/RestaurantAuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage';

import RestaurantHomePage from './restaurants/pages/RestaurantHomePage'
import RestaurantLoginPage from './restaurants/pages/RestaurantLoginPage'
import RestaurantRegisterPage from './restaurants/pages/RestaurantRegisterPage'
import RestaurantHeader from './components/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <PrivateRoute comp={HomePage} path="/" exact/>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegisterPage} path="/register"/>
        </AuthProvider>

        <RestaurantAuthProvider>
          <RestaurantPrivateRoute component={RestaurantHomePage} path="/partner-with-us" exact />
          <Route component={RestaurantLoginPage} path="/partner-with-us/login"/>
          <Route component={RestaurantRegisterPage} path="/partner-with-us/register"/>
        </RestaurantAuthProvider>
        

      </Router>
    </div>
  );
}

export default App;
