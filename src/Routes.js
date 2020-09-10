import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Lab from "./containers/Lab"
import Search from "./containers/Search"
import Vial from "./containers/Vial"
// import Map from "./containers/Map"
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Lab} props={childProps} />
    <AppliedRoute path="/lab" exact component={Lab} props={childProps} />
    <AppliedRoute path="/vial" exact component={Vial} props={childProps} />
    <AppliedRoute path="/search" exact component={Search} props={childProps} />
    {/* <AppliedRoute path="/map" exact component={Map} props={childProps} /> */}


    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
