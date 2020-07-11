import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";

// Pages
import Contact from "./pages/Contact";
import Home from "./pages/Home";

export const AppRoutes = () => (
  <App>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/contact/new">
        <Contact />
      </Route>
      <Route exact path="/contact/:contactId">
        <Contact />
      </Route>
    </Switch>
  </App>
);

export default function Routes() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
