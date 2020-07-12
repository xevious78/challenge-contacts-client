import React from "react";
import { Input } from "antd";
import { Controller, ValidationRules } from "react-hook-form";
import { InputProps } from "antd/lib/input";
import PhoneInput from "react-phone-number-input";

///////////////////////////////////////////
// FormInput
///////////////////////////////////////////
type FormInputProps = InputProps & {
  "data-testid"?: string;
  name: string;
  rules?: ValidationRules;
};

export const FormInput: React.FC<FormInputProps> = ({
  name,
  rules,
  ...rest
}) => (
  <Controller
    name={name}
    rules={rules}
    render={(props: any) => <Input {...props} {...rest} />}
  />
);

///////////////////////////////////////////
// FormPhoneInput
///////////////////////////////////////////

type FormPhoneInputProps = {
  "data-testid"?: string;
  name: string;
  rules?: ValidationRules;
};

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  rules,
  ...rest
}) => (
  <Controller
    name={name}
    rules={rules}
    render={(props: any) => (
      <PhoneInput {...props} displayInitialValueAsLocalNumber {...rest} />
    )}
  />
);
