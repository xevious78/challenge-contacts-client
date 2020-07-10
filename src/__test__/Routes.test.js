// app.test.js
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AppRoutes } from "../Routes";

describe("Routes", () => {
  describe("Route: /", () => {
    it("should render the Home page", () => {
      const history = createMemoryHistory();
      render(
        <Router history={history}>
          <AppRoutes />
        </Router>
      );

      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
  });

  describe("Route: /contact", () => {
    it("should render the contact page", () => {
      const history = createMemoryHistory();
      history.push("/contact");
      render(
        <Router history={history}>
          <AppRoutes />
        </Router>
      );

      expect(screen.getByTestId("contact-page")).toBeInTheDocument();
    });
  });

  describe("Route: /contact/:contactId", () => {
    it("should render the contact page", () => {
      const history = createMemoryHistory();
      history.push("/contact/1234");
      render(
        <Router history={history}>
          <AppRoutes />
        </Router>
      );

      expect(screen.getByTestId("contact-page")).toBeInTheDocument();
    });
  });
});
