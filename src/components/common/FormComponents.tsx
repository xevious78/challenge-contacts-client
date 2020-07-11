import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";

type FormInputProps = {
  name: string;
};

export const FormInput: React.FC<FormInputProps> = (props) => (
  <Controller name={props.name} render={(props: any) => <Input {...props} />} />
);
