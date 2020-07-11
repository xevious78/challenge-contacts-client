import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { FormInput } from "../common/FormComponents";
import FormRow from "../common/FormRow";

type Props = {
  loading?: boolean;
  disabled?: boolean;
};

const ContactForm = React.memo<Props>((props) => {
  const { loading = false, disabled = false } = props;
  const { errors } = useFormContext();

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

      <FormRow title="Address">
        <FormInput name="address" />
      </FormRow>
    </div>
  );
});

export default ContactForm;
