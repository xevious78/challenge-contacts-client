import React from "react";
import { Input } from "antd";
import { Controller, ValidationRules } from "react-hook-form";

type FormInputProps = {
  name: string;
  rules?: ValidationRules;
};

export const FormInput: React.FC<FormInputProps> = ({ name, rules }) => (
  <Controller
    name={name}
    rules={rules}
    render={(props: any) => <Input {...props} />}
  />
);
