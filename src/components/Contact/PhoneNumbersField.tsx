import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormRow from "../common/FormRow";
import { FormInput, FormPhoneInput } from "../common/FormComponents";

const MAX_PHONES = 10;
const MAX_LENGTH = 20;
const ERRORS: { [id: string]: string } = {
  maxLength: `A phone number should be smaller than ${MAX_LENGTH} characters`,
  required: `A phone number cannot be empty`,
};

const PhoneNumbersField = React.memo(() => {
  const { errors } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "phoneNumbers",
  });

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderInputError = (index: number) => {
    const error = errors.phoneNumbers?.[index]?.text;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return <span data-testid="phoneNumber-error">{content}</span>;
  };

  return (
    <FormRow title="Phone Numbers">
      <button
        type="button"
        disabled={fields.length > MAX_PHONES}
        onClick={() => append({ text: "" }, true)}
      >
        +
      </button>
      {fields.map((field, index) => (
        <div key={field.id} data-testid="phone-input-container">
          <FormPhoneInput
            name={`phoneNumbers[${index}].text`}
            data-testid="phone-input"
            rules={{ required: true, maxLength: MAX_LENGTH }}
          />
          {renderInputError(index)}
          <button onClick={() => remove(index)}>Delete</button>
        </div>
      ))}
    </FormRow>
  );
});

export default PhoneNumbersField;
