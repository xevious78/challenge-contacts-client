import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ContactCell from "../ContactCell";
import userEvent from "@testing-library/user-event";

const getContact = () => ({
  id: "contact-id",
  name: "name",
  jobTitle: "jobTitle",
  email: "email@test.fr",
  address: "address",
  phoneNumbers: [{ text: "+33 1 02 03 04 05" }, { text: "+33 6 01 02 03 04" }],
});

describe("ContactCell", () => {
  const setup = (props = {}) => {
    const contact = getContact();
    const onClick = jest.fn();
    const onDeleteClick = jest.fn();
    const methods = render(
      <ContactCell
        contact={contact}
        onClick={onClick}
        onDeleteClick={onDeleteClick}
        {...props}
      />
    );

    return { ...methods, onClick, onDeleteClick };
  };

  const getContactCell =  () => screen.getByTestId("contact-cell");
  const getDeleteButton = () => screen.getByTestId("delete-button");

  it("should render successfully", () => {
    setup();
  });

  it("should render the contact's name", () => {
    setup();

    expect(screen.getByText(/name/i)).toBeInTheDocument();
  });

  describe("onClick", () => {
    it("should call onClick when clicking on the cell", () => {
      const { onClick } = setup();

      userEvent.click(getContactCell());

      expect(onClick).toBeCalledTimes(1);
    });

    it("should not call onClick when isDeleting is true", () => {
      const { onClick } = setup({ isDeleting: true });

      userEvent.click(getContactCell());

      expect(onClick).not.toBeCalled();
    });
  });

  describe("Delete button", () => {
    it("should call onDeleteClick when clicking on the delete button", () => {
      const { onClick, onDeleteClick } = setup();

      userEvent.click(getDeleteButton());

      expect(onDeleteClick).toBeCalledTimes(1);
      expect(onClick).not.toBeCalled();
    });

    it("should not call onDeleteClick when isDeleting is true", () => {
      const { onDeleteClick } = setup({ isDeleting: true });

      userEvent.click(getDeleteButton());

      expect(onDeleteClick).not.toBeCalled();
    });

    it("should not call onDeleteClick when deleteDisabled is true", () => {
      const { onDeleteClick } = setup({ deleteDisabled: true });

      userEvent.click(getDeleteButton());

      expect(onDeleteClick).not.toBeCalled();
    });
  });
});
