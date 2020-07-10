import React, { useState, useEffect, SyntheticEvent } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from "../service/api";
import { Modal, Input, Button } from "antd";
import delay from "../utils/delay";

const Contact = () => {
  const { contactId } = useParams();
  const history = useHistory();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

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
    console.log("fetching", contactId);
    setIsFetching(true);
    await delay(2000);

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
    } catch (e) {
      //TODO: Error
    } finally {
      setIsUpdating(false);
    }
  };

  const create = async (contactInfos: any) => {
    setIsCreating(true);
    //TODO: Check values

    await delay(2000);
    try {
      const response = await API.contact.createContact(contactInfos);
      console.log(response);
      const { contact } = response.data;
      history.replace(`/contact/${contact.id}`);
    } catch (e) {
      //TODO: Error
    } finally {
      setIsCreating(false);
    }
  };

  ///////////////////////////////////////////
  // Name Cb
  ///////////////////////////////////////////

  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactName(e.target.value);
  };

  ///////////////////////////////////////////
  // Toolbar Cb
  ///////////////////////////////////////////

  const handleSaveClick = () => {
    const contactInfos = {
      id: contactId,
      name: contactName,
    };

    update(contactId, contactInfos);
  };

  const handleCreateClick = () => {
    const contactInfos = {
      name: contactName,
    };

    create(contactInfos);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////

  const renderToolbar = () => {
    if (contactId) {
      return (
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
      );
    } else {
      return (
        <div>
          <Button
            type="primary"
            disabled={isUpdating}
            loading={isCreating}
            onClick={handleCreateClick}
          >
            Create
          </Button>
        </div>
      );
    }
  };

  return (
    <div data-testid="contact-page">
      <div>
        <div>Name</div>
        <Input value={contactName} onChange={handleContactNameChange} />
      </div>
      <div>{renderToolbar()}</div>
    </div>
  );
};

export default Contact;
