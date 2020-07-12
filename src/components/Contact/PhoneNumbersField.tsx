import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormRow from "../common/FormRow";
import { FormInput, FormPhoneInput } from "../common/FormComponents";

const MAX_PHONES = 10;
const MAX_LENGTH = 100;
const ERRORS: { [id: string]: string } = {};

const PhoneNumbersField = React.memo(() => {
  const { errors } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "phoneNumbers",
  });

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderError = () => {
    const error = errors.phoneNumbers;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return <span data-testid="phoneNumbers-error">{content}</span>;
  };

  return (
    <FormRow title="Phone Numbers" errorMessage={renderError()}>
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
          />
          <button onClick={() => remove(index)}>Delete</button>
        </div>
      ))}
    </FormRow>
  );
});

export default PhoneNumbersField;
