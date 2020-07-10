import React, { useState, useEffect, SyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import API from "../service/api";
import { Modal, Input, Button } from "antd";
import delay from "../utils/delay";

const Contact = () => {
  const { contactId } = useParams();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [contact, setContact] = useState(null);

  const [contactName, setContactName] = useState("");

  useEffect(() => {
    if (contactId) {
      fetch(contactId);
    }
  }, [contactId]);

  ///////////////////////////////////////////
  // Network
  ///////////////////////////////////////////
  const fetch = async (contactId: string) => {
    setIsFetching(true);
    try {
      const response = await API.contact.getContact(contactId);
      const { contact } = response.data;
      setContact(contact);
      setContactName(contact.name);
    } catch (e) {
      //TODO: Error
      Modal.error({
        title: "Error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const update = async (contactId: string, contactInfos: any) => {
    setIsUpdating(true);
    //TODO: Check values

    await delay(2000);
    try {
      const response = await API.contact.updateContact(contactId, contactInfos);
      console.log(response);
    } catch (e) {
      //TODO: Error
    } finally {
      setIsUpdating(false);
    }
  };

  ///////////////////////////////////////////
  // Name Cb
  ///////////////////////////////////////////

  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactName(e.target.value);
  };

  ///////////////////////////////////////////
  // Buttons Cb
  ///////////////////////////////////////////

  const handleSaveClick = () => {
    const contactInfos = {
      id: contactId,
      name: contactName,
    };

    update(contactId, contactInfos);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div data-testid="contact-page">
      <div>
        <div>Name</div>
        <Input value={contactName} onChange={handleContactNameChange} />
      </div>
      <div>
        <Button
          type="primary"
          disabled={isFetching || isUpdating}
          loading={isUpdating}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Contact;
