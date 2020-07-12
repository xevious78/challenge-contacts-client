import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput, FormPhoneInput } from "../common/FormComponents";
import FormRow from "../common/FormRow";
import NameField from "./NameField";
import JobTitleField from "./JobTitleField";

type Props = {
  loading?: boolean;
  disabled?: boolean;
};

const ContactForm = React.memo<Props>((props) => {
  const { errors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "phoneNumbers",
  });

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div>
      <NameField />
      <JobTitleField />
      
      <FormRow
        title="Email"
        errorMessage={
          errors.email && (
            <span data-testid="email-error">Email is invalid</span>
          )
        }
      >
        <FormInput
          name="email"
          type="email"
          rules={{
            required: false,
            validate: (value) =>
              !value || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
          }}
          data-testid="email-input"
        />
      </FormRow>

      <FormRow title="Address">
        <FormInput name="address" data-testid="address-input" />
      </FormRow>

      <FormRow title="Phone Numbers">
        <button type="button" onClick={() => append({ text: "" }, true)}>
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
    </div>
  );
});

export default ContactForm;
