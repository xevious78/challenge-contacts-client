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
    getContact: jest.fn(),
    updateContact: jest.fn(),
  },
}));

describe("ContactPage", () => {
  const setup = (contactId) => {
    const history = createMemoryHistory();
    history.push(`/contact/${contactId}`);
    const methods = render(
      <MobxProvider {...rootStore.ContactStore}>
        <Router history={history}>
          <AppRoutes />
        </Router>
      </MobxProvider>
    );

    return { ...methods, history };
  };

  describe("fetch", () => {
    it("should call the getContact API upon loading", async () => {
      API.contact.getContact = jest.fn(() =>
        Promise.resolve({ data: { id: "123" } })
      );
      setup("123");

      await waitFor(() => expect(API.contact.getContact).toBeCalledTimes(1));
    });

    describe("404 message", () => {
      beforeEach(() => {
        API.contact.getContact = jest.fn(() =>
          Promise.reject({ response: { status: 404 } })
        );
      });

      afterEach(() => {
        Modal.destroyAll();
      });
      it("should display a 404 error message if the contact does not exist", async () => {
        setup("id");

        await waitFor(() => expect(API.contact.getContact).toBeCalledTimes(1));
        await waitFor(() =>
          expect(screen.getByText(/does not exist/i)).toBeInTheDocument()
        );
      });

      it("should go to Home Page when clicking on Go Back", async () => {
        const { history } = setup("id");

        await waitFor(() => expect(API.contact.getContact).toBeCalledTimes(1), {
          timeout: 2000,
        });
        await waitFor(() =>
          expect(screen.getByText(/does not exist/i)).toBeInTheDocument()
        );

        const goBackButton = screen.getByText(/go back/i);
        userEvent.click(goBackButton);
        expect(history.location.pathname).toEqual("/");
      });
    });

    describe("Error message", () => {
      beforeEach(() => {
        API.contact.getContact = jest.fn(() =>
          Promise.reject({ response: { status: 400 } })
        );
      });

      afterEach(() => {
        // close modal
        Modal.destroyAll();
      });
      it("should display an error message if fetch fails", async () => {
        setup("id");

        await waitFor(() => expect(API.contact.getContact).toBeCalledTimes(1), {
          timeout: 2000,
        });
        await waitFor(() =>
          expect(screen.getByText(/error/i)).toBeInTheDocument()
        );
      });

      it("should go to Home Page when clicking on Go Back", async () => {
        const { history } = setup("id");

        await waitFor(() => expect(API.contact.getContact).toBeCalledTimes(1), {
          timeout: 2000,
        });
        await waitFor(() =>
          expect(screen.getByText(/error/i)).toBeInTheDocument()
        );

        const goBackButton = screen.getByText(/go back/i);
        userEvent.click(goBackButton);
        expect(history.location.pathname).toEqual("/");
      });
    });
  });
});
