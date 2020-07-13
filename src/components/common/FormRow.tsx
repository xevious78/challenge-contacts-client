import React from "react";
import styles from "./FormRow.module.scss";
import ClassName from "../../utils/classname";

type Props = {
  title: string;
  errorMessage?: string | JSX.Element;
};

const FormRow: React.FC<Props> = ({ title, errorMessage, children }) => {
  const cn = ClassName(styles, "form-row");
  return (
    <div className={cn()}>
      <div className={cn("title")}>{title}</div>
      <div className={cn("content")}>{children}</div>
      {errorMessage && <div className={cn("error")}>{errorMessage}</div>}
    </div>
  );
};

export default FormRow;
