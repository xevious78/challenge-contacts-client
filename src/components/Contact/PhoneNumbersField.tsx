import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormPhoneInput } from "../common/FormComponents";
import ClassName from "../../utils/classname";
import styles from "./PhoneNumbersField.module.scss";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useContactFormContext } from "../../contexts/ContactFormContext";

const MAX_PHONES = 10;
const MAX_LENGTH = 20;
const ERRORS: { [id: string]: string } = {
  maxLength: `A phone number should be smaller than ${MAX_LENGTH} characters`,
  required: `A phone number cannot be empty`,
};

const PhoneNumbersField = React.memo(() => {
  const { errors } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "phoneNumbers",
  });
  const { disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const cn = ClassName(styles, "phone-numbers-form-row");
  const fieldCn = ClassName(styles, "phone-numbers-field");

  const renderInputError = (index: number) => {
    const error = errors.phoneNumbers?.[index]?.text;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return (
      <div className={fieldCn("error")} data-testid="phoneNumber-error">
        {content}
      </div>
    );
  };

  return (
    <div className={cn()}>
      <div className={cn("title-container")}>
        <div className={cn("title")}>Phone numbers</div>
        <div className={cn("button")}>
          <Button
            size={"small"}
            icon={<PlusOutlined />}
            disabled={fields.length > MAX_PHONES || disabled}
            onClick={() => append({ text: "" }, true)}
          />
        </div>
      </div>

      <div className={cn("fields")}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={fieldCn()}
            data-testid="phone-input-container"
          >
            <div className={fieldCn("top-container")}>
              <div className={fieldCn("input")}>
                <FormPhoneInput
                  name={`phoneNumbers[${index}].text`}
                  data-testid="phone-input"
                  rules={{ required: true, maxLength: MAX_LENGTH }}
                  disabled={disabled}
                />
              </div>
              <Button
                icon={<MinusOutlined />}
                size="small"
                className={fieldCn("button")}
                disabled={disabled}
                onClick={() => remove(index)}
              />
            </div>
            {renderInputError(index)}
          </div>
        ))}
      </div>
    </div>
  );
});

export default PhoneNumbersField;
