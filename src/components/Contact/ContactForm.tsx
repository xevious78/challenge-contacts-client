import React from "react";
import PictureField from "./PictureField";
import NameField from "./NameField";
import JobTitleField from "./JobTitleField";
import EmailField from "./EmailField";
import AddressField from "./AddressField";
import PhoneNumbersField from "./PhoneNumbersField";
import styles from "./ContactForm.module.scss";
import ClassName from "../../utils/classname";

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
  const cn = ClassName(styles, "contact-form");

  return (
    <div className={cn()}>
      <PictureField onUploadPictureChange={onUploadPictureChange} />
      <div className={cn("form-rows")}>
        <NameField />
        <JobTitleField />
        <EmailField />
        <AddressField />
        <PhoneNumbersField />
      </div>
    </div>
  );
});

export default ContactForm;
