import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../service/api";
import { Modal } from "antd";

const Contact = () => {
  const { contactId } = useParams();

  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    if (contactId) {
      fetch(contactId);
    }
  }, [contactId]);

  const fetch = async (contactId: string) => {
    setIsFetching(true);
    try {
      const response = await API.contact.getContact(contactId);
      setContact(response.data.contact);
    } catch (e) {
      //TODO: Error
      Modal.error({
        title: "Error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div data-testid="contact-page">
      Contact<div>{JSON.stringify(contact)}</div>
    </div>
  );
};

export default Contact;
