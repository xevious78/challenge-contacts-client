import React from "react";
import { useFormContext } from "react-hook-form";
import FormRow from "../../common/FormRow";
import { FormInput } from "../../common/FormComponents";
import { useContactFormContext } from "../../../contexts/ContactFormContext";

const MAX_LENGTH = 100;
const ERRORS: { [id: string]: string } = {
  required: "Name is required",
  maxLength: `Name should be smaller than ${MAX_LENGTH} characters`,
  default: "Name is invalid",
};

const NameField = React.memo(() => {
  const { errors } = useFormContext();
  const { disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderError = () => {
    const nameError = errors.name;
    if (!nameError) {
      return;
    }

    const content = ERRORS[nameError.type] ?? ERRORS.default;

    return <span data-testid="name-error">{content}</span>;
  };

  return (
    <FormRow title="Name" errorMessage={renderError()}>
      <FormInput
        name="name"
        rules={{ required: true, maxLength: MAX_LENGTH }}
        disabled={disabled}
        data-testid="name-input"
      />
    </FormRow>
  );
});

export default NameField;
