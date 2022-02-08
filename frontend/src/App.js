import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import RestaurantPrivateRoute from './restaurants/utils/RestaurantPrivateRoute'
import { RestaurantAuthProvider } from './restaurants/context/RestaurantAuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
import ViewFoodItems from './pages/ViewFoodItems';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';

import RestaurantHomePage from './restaurants/pages/RestaurantHomePage'
import RestaurantLoginPage from './restaurants/pages/RestaurantLoginPage'
import RestaurantRegisterPage from './restaurants/pages/RestaurantRegisterPage'
import ManageFoodItems from './restaurants/pages/ManageFoodItems'
import AddFoodItem from './restaurants/pages/AddFoodItem'
import ManageOrders from './restaurants/pages/ManageOrders'
import EditFoodItem from './restaurants/pages/EditFoodItem';
import RestaurantAccountSetup from './restaurants/pages/RestaurantAccountSetup';
import StripeReturnUrlPage from './restaurants/pages/StripeReturnUrlPage';
import StripeRefreshUrlPage from './restaurants/pages/StripeRefreshUrlPage';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Route component={LoginPage} path="/login"/>
          <Route component={RegisterPage} path="/register"/>
          <Route component={LandingPage} path="/" exact />
          <Route component={HomePage} path="/restaurants" exact/>
          <PrivateRoute component={UserProfile} path="/my-account"  exact />
          <PrivateRoute component={ViewFoodItems} path="/restaurants/:id" exact/>
          <PrivateRoute component={CheckoutPage} path='/checkout' exact />
          <PrivateRoute component={CheckoutSuccessPage} path='/checkout/success' exact />
          <PrivateRoute component={CheckoutCancelPage} path='/checkout/cancel' exact />
        </AuthProvider>

        <RestaurantAuthProvider>
          <Route component={RestaurantHomePage} path="/partner-with-us" exact />
          <Route component={RestaurantLoginPage} path="/partner-with-us/login"/>
          <Route component={RestaurantRegisterPage} path="/partner-with-us/register"/>
          <RestaurantPrivateRoute component={ManageFoodItems} path="/partner-with-us/manage-food-items" exact />
          <RestaurantPrivateRoute component={EditFoodItem} path="/partner-with-us/manage-food-items/:id" exact />
          <RestaurantPrivateRoute component={AddFoodItem} path="/partner-with-us/add-food-item" exact />
          <RestaurantPrivateRoute component={ManageOrders} path="/partner-with-us/orders" exact />
          <RestaurantPrivateRoute component={RestaurantAccountSetup} path="/partner-with-us/account-setup" exact /> 
          <RestaurantPrivateRoute component={StripeReturnUrlPage} path="/partner-with-us/account-setup/return-url" exact />
          <RestaurantPrivateRoute component={StripeRefreshUrlPage} path="/partner-with-us/account-setup/refresh-url" exact/>
        </RestaurantAuthProvider>

      </Router>
    </div>
  );
}

export default App;
