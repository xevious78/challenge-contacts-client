import React from "react";

type Props = {
  title: string;
  errorMessage?: string | JSX.Element;
};

const FormRow: React.FC<Props> = ({ title, errorMessage, children }) => (
  <div>
    <div>{title}</div>
    <div>{children}</div>
    {errorMessage && <div>{errorMessage}</div>}
  </div>
);

export default FormRow;
