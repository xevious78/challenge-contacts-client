import React, { useEffect } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useForm, FormProvider } from "react-hook-form";
import userEvent from "@testing-library/user-event";

import ContactForm from "../ContactForm";

const TestContactForm = ({ formData, onSubmit }) => {
  const methods = useForm();

  useEffect(() => {
    if (formData) {
      methods.reset(formData);
    }
  }, [formData]);

  return (
    <FormProvider {...methods}>
      <form data-testid="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <ContactForm />
      </form>
    </FormProvider>
  );
};

const getFormData = () => ({
  name: "name",
  jobTitle: "jobTitle",
  email: "email@test.fr",
  address: "address",
  phoneNumbers: [{ text: "+33 1 02 03 04 05" }, { text: "+33 6 01 02 03 04" }],
});

describe("ContactForm", () => {
  const setup = (formData) => {
    const onSubmit = jest.fn();
    const methods = render(
      <TestContactForm formData={formData} onSubmit={onSubmit} />
    );
    const form = screen.getByTestId("form");
    return { ...methods, form: form, onSubmit: onSubmit };
  };

  it("should render successfully", () => {
    setup();
  });

  it("should fill the form with the given contact data", () => {
    setup(getFormData());

    expect(screen.getByTestId("name-input")).toHaveAttribute("value", "name");
    expect(screen.getByTestId("jobTitle-input")).toHaveAttribute(
      "value",
      "jobTitle"
    );
    expect(screen.getByTestId("email-input")).toHaveAttribute(
      "value",
      "email@test.fr"
    );
    expect(screen.getByTestId("address-input").textContent).toEqual("address");

    const phoneInputs = screen.getAllByTestId("phone-input");
    expect(phoneInputs.length).toBe(2);
    expect(phoneInputs.map((phoneInput) => phoneInput.value)).toEqual([
      "01 02 03 04 05",
      "06 01 02 03 04",
    ]);
  });

  describe("Name input", () => {
    it("should not display a required error when name is valid", async () => {
      const formData = getFormData();
      const { form, onSubmit } = setup(formData);

      fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
      });
      expect(onSubmit).toBeCalled();
    });

    it("should display a required error when name is empty", async () => {
      const { form, onSubmit } = setup({ name: "" });

      fireEvent.submit(form);
      expect(await screen.findAllByTestId("name-error")).toHaveLength(1);
      expect(onSubmit).not.toBeCalled();
    });
  });

  describe("Email input", () => {
    it("should not display an invalid error when email is empty", async () => {
      const formData = getFormData();
      formData.email = "";
      const { form, onSubmit } = setup(formData);

      fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
      });
      expect(onSubmit).toBeCalled();
    });

    it("should not display an invalid error when email is valid", async () => {
      const formData = getFormData();
      const { form, onSubmit } = setup(formData);

      fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
      });
      expect(onSubmit).toBeCalled();
    });

    it("should display an invalid error when email is invalid", async () => {
      const { form, onSubmit } = setup({ email: "email" });

      fireEvent.submit(form);
      expect(await screen.findAllByTestId("email-error")).toHaveLength(1);
      expect(onSubmit).not.toBeCalled();
    });
  });

});
