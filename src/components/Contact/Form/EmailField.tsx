import React from "react";
import { useFormContext } from "react-hook-form";
import FormRow from "../../common/FormRow";
import { FormInput } from "../../common/FormComponents";
import { useContactFormContext } from "../../../contexts/ContactFormContext";

const MAX_LENGTH = 100;
const ERRORS: { [id: string]: string } = {
  invalid: `Email is invalid`,
  maxLength: `Email should be smaller than ${MAX_LENGTH} characters`,
};

const EmailField = React.memo(() => {
  const { errors } = useFormContext();
  const { disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderError = () => {
    const error = errors.email;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return <span data-testid="email-error">{content}</span>;
  };

  return (
    <FormRow title="Email" errorMessage={renderError()}>
      <FormInput
        name="email"
        type="email"
        rules={{
          required: false,
          validate: {
            invalid: (value: string) =>
              !value || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
            maxLength: (value?: string) => !value || value.length <= MAX_LENGTH,
          },
        }}
        data-testid="email-input"
        disabled={disabled}
      />
    </FormRow>
  );
});

export default EmailField;
