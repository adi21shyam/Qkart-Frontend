import Register from "./components/Register";
import Login from "./components/Login";
// import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
export const config = {
  endpoint: `https://qkart-1.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
       <Switch>
        <Route exact path="/">
          <Products />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/thanks">
          <Thanks />
        </Route>
        </Switch>
    </div>
  );
}

export default App;
