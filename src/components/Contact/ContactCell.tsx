import React from "react";
import { Contact } from "../../types";

type Props = {
  contact: Contact;
  onClick: (contact: Contact) => void;
};

const ContactCell = React.memo<Props>((props) => {
  const { contact, onClick } = props;

  ///////////////////////////////////////////
  // Cb
  ///////////////////////////////////////////

  const handleClick = () => {
    onClick(contact);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return <div onClick={handleClick}>{contact.name}</div>;
});

export default ContactCell;
