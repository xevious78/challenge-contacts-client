import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { FormInput } from "../common/FormComponents";

type Props = {
  loading?: boolean;
  disabled?: boolean;
};

const ContactForm = React.memo<Props>((props) => {
  const { loading = false, disabled = false } = props;

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div>
      Name
      <FormInput name="name" />
    </div>
  );
});

export default ContactForm;
