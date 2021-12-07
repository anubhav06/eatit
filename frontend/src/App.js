import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import RestaurantPrivateRoute from './restaurants/utils/RestaurantPrivateRoute'
import { RestaurantAuthProvider } from './restaurants/context/RestaurantAuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';

import RestaurantHomePage from './restaurants/pages/RestaurantHomePage'
import RestaurantLoginPage from './restaurants/pages/RestaurantLoginPage'
import RestaurantRegisterPage from './restaurants/pages/RestaurantRegisterPage'
import ManageFoodItems from './restaurants/pages/ManageFoodItems'
import AddFoodItem from './restaurants/pages/AddFoodItem'
import ManageOrders from './restaurants/pages/ManageOrders'
import EditFoodItem from './restaurants/pages/EditFoodItem';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <PrivateRoute component={HomePage} path="/" exact/>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegisterPage} path="/register"/>
        </AuthProvider>

        <RestaurantAuthProvider>
          <Route component={RestaurantLoginPage} path="/partner-with-us/login"/>
          <Route component={RestaurantRegisterPage} path="/partner-with-us/register"/>
          <Route component={RestaurantHomePage} path="/partner-with-us" exact />
          <RestaurantPrivateRoute component={ManageFoodItems} path="/partner-with-us/manage-food-items" exact />
          <RestaurantPrivateRoute component={EditFoodItem} path="/partner-with-us/manage-food-items/:id" exact />
          <RestaurantPrivateRoute component={AddFoodItem} path="/partner-with-us/add-food-item" exact />
          <RestaurantPrivateRoute component={ManageOrders} path="/partner-with-us/orders" exact />
        </RestaurantAuthProvider>

      </Router>
    </div>
  );
}

export default App;
