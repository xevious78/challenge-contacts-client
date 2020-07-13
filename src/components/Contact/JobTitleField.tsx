import React from "react";
import { useFormContext } from "react-hook-form";
import FormRow from "../common/FormRow";
import { FormInput } from "../common/FormComponents";
import { useContactFormContext } from "../../contexts/ContactFormContext";

const MAX_LENGTH = 100;
const ERRORS: { [id: string]: string } = {
  maxLength: `The job title should be smaller than ${MAX_LENGTH} characters`,
  default: "The job title is invalid",
};

const JobTitleField = React.memo(() => {
  const { errors } = useFormContext();
  const { disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const renderError = () => {
    const error = errors.jobTitle;
    if (!error) {
      return;
    }

    const content = ERRORS[error.type] ?? ERRORS.default;

    return <span data-testid="jobTitle-error">{content}</span>;
  };

  return (
    <FormRow title="Job Title" errorMessage={renderError()}>
      <FormInput
        name="jobTitle"
        data-testid="jobTitle-input"
        rules={{ required: false, maxLength: MAX_LENGTH }}
        disabled={disabled}
      />
    </FormRow>
  );
});

export default JobTitleField;
