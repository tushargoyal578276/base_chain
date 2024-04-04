import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// importing all the themes
import Collections from "../components/Collections/Collections";
import PrivateDash from "../components/Collections/PrivateDash";
import PrivateDashBinance from "../components/Collections/PrivateDashBinance";
import Header from "../components/Header/Header";

function MyRouts() {
  return (
    <>
      <Router basename={'/'}>
        <Switch>
          <Route exact path="/" >
            <Header  />
            <Collections />
          </Route>     
          <Route exact path="/sale" >
            <Header />
            <PrivateDash />
          </Route>
          <Route exact path="/sale-binance" >
            <Header />
            <PrivateDashBinance />
          </Route>
        </Switch>          
      </Router>
    </>
  );
}

export default MyRouts;