import React from "react";
import PictureField from "./PictureField";
import NameField from "./NameField";
import JobTitleField from "./JobTitleField";
import EmailField from "./EmailField";
import AddressField from "./AddressField";
import PhoneNumbersField from "./PhoneNumbersField";
import styles from "./ContactForm.module.scss";
import ClassName from "../../../utils/classname";
import { ContactFormContext } from "../../../contexts/ContactFormContext";
import LoadingOverlay from "../../common/LoadingOverlay";

export type FormValues = {
  pictureId: string;
  name: string;
  jobTitle: string;
  email: string;
  address: string;
  phoneNumbers?: Array<{ text: string }>;
};

export const formValuesToContactInfos = (data: FormValues) => ({
  pictureId: data.pictureId,
  name: data.name,
  jobTitle: data.jobTitle,
  email: data.email,
  address: data.address,
  phoneNumbers: data.phoneNumbers?.map((a) => a.text).filter((a) => !!a) ?? [], // take only non-empty phone numbers
});

type Props = {
  isLoading?: boolean;
  disabled?: boolean;
  onUploadPictureChange?: (isUploading: boolean) => void;
};

const ContactForm = React.memo<Props>((props) => {
  const { isLoading = false, disabled = false } = props;
  const { onUploadPictureChange } = props;

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const cn = ClassName(styles, "contact-form");

  return (
    <ContactFormContext.Provider value={{ isLoading, disabled }}>
      <div className={cn()}>
        <div className={cn("picture-container")}>
          <PictureField onUploadPictureChange={onUploadPictureChange} />
        </div>
        <div className={cn("form-rows-container")}>
          <div className={cn("form-rows")}>
            <NameField />
            <JobTitleField />
            <EmailField />
            <AddressField />
            <PhoneNumbersField />
          </div>
          <LoadingOverlay isLoading={isLoading} />
        </div>
      </div>
    </ContactFormContext.Provider>
  );
});

export default ContactForm;
