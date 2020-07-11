import React from "react";
import { Input } from "antd";
import { Controller, ValidationRules } from "react-hook-form";
import { InputProps } from "antd/lib/input";

type FormInputProps = InputProps & {
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
