import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./App";

// Pages
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import CreateContactPage from "./pages/CreateContactPage";

export const AppRoutes = () => (
  <App>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/contact/new">
        <CreateContactPage />
      </Route>
      <Route exact path="/contact/:contactId">
        <ContactPage />
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
