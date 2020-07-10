import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";

// Pages
import Contact from "./pages/Contact";
import Home from "./pages/Home";

export default function Routes() {
  return (
    <App>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/contact/:contactId">
            <Contact />
          </Route>
        </Switch>
      </Router>
    </App>
  );
}
