import React from "react";
import PictureField from "./PictureField";
import NameField from "./NameField";
import JobTitleField from "./JobTitleField";
import EmailField from "./EmailField";
import AddressField from "./AddressField";
import PhoneNumbersField from "./PhoneNumbersField";

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onUploadPictureChange?: (isUploading: boolean) => void;
};

const ContactForm = React.memo<Props>((props) => {
  const { onUploadPictureChange } = props;
  
  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div>
      <PictureField onUploadPictureChange={onUploadPictureChange} />
      <NameField />
      <JobTitleField />
      <EmailField />
      <AddressField />
      <PhoneNumbersField />
    </div>
  );
});

export default ContactForm;
