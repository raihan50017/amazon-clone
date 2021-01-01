import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Checkout from './Checkout';
import Login from './Login';
import { useStateValue } from './StateProvider';
import { useEffect } from 'react';
import { auth } from './firebase';
import Payment from './Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Orders from './Orders';

const promise = loadStripe('pk_test_51HavVyFYQlFGDS7G7lCAXRDpjVZDyLxiM480gbNZStxg3vpPXu18mCfMmuGAw75KeqhLMtnWKFTONT5ekR1OgLT9002JDnpKQK')

function App() {

  const [{ user }, dispatch] = useStateValue();

  console.log("Auth user=", user);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        dispatch({
          type: 'SET_USER',
          user: user
        })
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    });
  }, [])

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header></Header>
            <Orders></Orders>
          </Route>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/checkout">
            <Header></Header>
            <Checkout></Checkout>
          </Route>
          <Route path="/payment">
            <Header></Header>
            <Elements stripe={promise}>
              <Payment></Payment>
            </Elements>
          </Route>
          <Route path="/">
            <Header></Header>
            <Home></Home>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
