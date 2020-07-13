import React from "react";
import { Contact } from "../../../types";
import { Button } from "antd";
import styles from "./ContactCell.module.scss";
import ClassName from "../../../utils/classname";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
  contact: Contact;
  deleteDisabled?: boolean;
  isDeleting?: boolean;
  onClick: (contact: Contact) => void;
  onDeleteClick: (contact: Contact) => void;
};

export const CONTACT_CELL_SIZE = 60;

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
  const cn = ClassName(styles, "contact-cell");

  return (
    <div
      className={cn({ "is-deleting": isDeleting })}
      data-testid="contact-cell"
      onClick={handleClick}
    >
      <div className={cn("name")}>{contact.name}</div>
      <div className={cn("buttons")}>
        <Button
          data-testid="delete-button"
          icon={<DeleteOutlined />}
          loading={isDeleting}
          disabled={isDeleting || deleteDisabled}
          onClick={handleDeleteClick}
        />
      </div>
    </div>
  );
});

export default ContactCell;
