import React from "react";
import { Contact } from "../../types";
import { Button } from "antd";

type Props = {
  contact: Contact;
  deleteDisabled?: boolean;
  isDeleting?: boolean;
  onClick: (contact: Contact) => void;
  onDeleteClick: (contact: Contact) => void;
};

const ContactCell = React.memo<Props>((props) => {
  const { contact, isDeleting = false, deleteDisabled = false } = props;
  const { onClick, onDeleteClick } = props;

  ///////////////////////////////////////////
  // Cb
  ///////////////////////////////////////////

  const handleClick = () => {
    if (isDeleting) {
      return;
    }
    onClick(contact);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    if (isDeleting) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    onDeleteClick(contact);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div onClick={handleClick}>
      {contact.name}
      <Button
        loading={isDeleting}
        disabled={isDeleting || deleteDisabled}
        onClick={handleDeleteClick}
      >
        Delete
      </Button>
    </div>
  );
});

export default ContactCell;
