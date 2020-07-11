import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { FormInput } from "../common/FormComponents";
import FormRow from "../common/FormRow";

type Props = {
  loading?: boolean;
  disabled?: boolean;
};

const ContactForm = React.memo<Props>((props) => {
  const { loading = false, disabled = false } = props;
  const { errors, control } = useFormContext();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "phoneNumbers", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div>
      <FormRow title="Name" errorMessage={errors.name && "Name is required"}>
        <FormInput name="name" rules={{ required: true }} />
      </FormRow>

      <FormRow title="Job Title">
        <FormInput name="jobTitle" />
      </FormRow>

      <FormRow title="Email" errorMessage={errors.email && "Email is invalid"}>
        <FormInput
          name="email"
          type="email"
          rules={{
            required: false,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address",
            },
          }}
        />
      </FormRow>

      <FormRow title="Address">
        <FormInput name="address" />
      </FormRow>

      <FormRow title="Phone Numbers">
        <button type="button" onClick={() => append({ text: "" }, true)}>
          +
        </button>
        {fields.map((field, index) => (
          <div key={field.id}>
            <FormInput name={`phoneNumbers[${index}].text`} />
            <button onClick={() => remove(index)}>Delete</button>
          </div>
        ))}
      </FormRow>
    </div>
  );
});

export default ContactForm;
