import React from "react";
import NameField from "./NameField";
import JobTitleField from "./JobTitleField";
import EmailField from "./EmailField";
import AddressField from "./AddressField";
import PhoneNumbersField from "./PhoneNumbersField";

type Props = {
  loading?: boolean;
  disabled?: boolean;
};

const ContactForm = React.memo<Props>((props) => {
  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div>
      <NameField />
      <JobTitleField />
      <EmailField />
      <AddressField />
      <PhoneNumbersField />
    </div>
  );
});

export default ContactForm;
