import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useForm, FormProvider } from "react-hook-form";
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

describe("ContactForm", () => {
  const setup = (formData) => {
    const methods = render(<TestContactForm formData={formData} />);

    return { ...methods };
  };

  it("should render successfully", () => {
    setup();
  });

  it("should fill the form with the given contact data", () => {
    setup({
      name: "name",
      jobTitle: "jobTitle",
      email: "email",
      address: "address",
      phoneNumbers: [
        { text: "+33 1 02 03 04 05" },
        { text: "+33 6 01 02 03 04" },
      ],
    });

    expect(screen.getByTestId("name-input")).toHaveAttribute("value", "name");
    expect(screen.getByTestId("jobTitle-input")).toHaveAttribute(
      "value",
      "jobTitle"
    );
    expect(screen.getByTestId("email-input")).toHaveAttribute("value", "email");
    expect(screen.getByTestId("address-input")).toHaveAttribute(
      "value",
      "address"
    );

    const phoneInputs = screen.getAllByTestId("phone-input");
    expect(phoneInputs.length).toBe(2);
    expect(phoneInputs.map((phoneInput) => phoneInput.value)).toEqual([
      "01 02 03 04 05",
      "06 01 02 03 04",
    ]);
  });
});
