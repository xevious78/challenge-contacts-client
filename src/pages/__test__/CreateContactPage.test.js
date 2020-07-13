import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider as MobxProvider } from "mobx-react";
import { rootStore } from "../../stores";
import API, { CancelToken } from "../../service/api";
import { AppRoutes } from "../../Routes";
import userEvent from "@testing-library/user-event";
import Modal from "antd/lib/modal/Modal";

jest.mock("../../service/api", () => ({
  contact: {
    createContact: jest.fn(),
  },
}));

describe("CreateContactPage", () => {
  const setup = () => {
    const history = createMemoryHistory();
    history.push(`/contact/new`);
    const methods = render(
      <MobxProvider {...rootStore.ContactStore}>
        <Router history={history}>
          <AppRoutes />
        </Router>
      </MobxProvider>
    );

    return { ...methods, history };
  };

  it("should render successfully", () => {
    setup();
  });

  it("should call API createContact when clicking on create", () => {
    setup();

    
  });
});
