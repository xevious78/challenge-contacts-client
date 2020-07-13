import React from "react";
import { useFormContext } from "react-hook-form";
import FormRow from "../../common/FormRow";
import { FormTextArea } from "../../common/FormComponents";
import { useContactFormContext } from "../../../contexts/ContactFormContext";

const MAX_LENGTH = 400;
const ERRORS: { [id: string]: string } = {
  maxLength: `Address should be smaller than ${MAX_LENGTH} characters`,
};

const AddressField = React.memo(() => {
  const { errors } = useFormContext();
  const { disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderError = () => {
    const error = errors.address;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return <span data-testid="address-error">{content}</span>;
  };

  return (
    <FormRow title="Address" errorMessage={renderError()}>
      <FormTextArea
        name="address"
        data-testid="address-input"
        rules={{ maxLength: MAX_LENGTH }}
        disabled={disabled}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </FormRow>
  );
});

export default AddressField;
