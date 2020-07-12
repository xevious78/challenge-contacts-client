import React, { useEffect, useState } from "react";
import { observer, useObserver } from "mobx-react";
import { useStores } from "../stores";
import ContactCell from "../components/Contact/ContactCell";
import { Contact } from "../types";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "antd";
import delay from "../utils/delay";
import API from "../service/api";

const Home = observer(() => {
  const history = useHistory();
  const { ContactStore } = useStores();

  const [isDeletingContactId, setIsDeletingContactId] = useState<
    string | null
  >();

  ///////////////////////////////////////////
  // Network
  ///////////////////////////////////////////

  const deleteContact = async (contactId: string) => {
    setIsDeletingContactId(contactId);

    await delay(1000);

    try {
      await API.contact.deleteContact(contactId);
      ContactStore.removeContact(contactId);
      setIsDeletingContactId(null);
    } catch (e) {
      Modal.error({
        title: `An error occured while deleting "${
          ContactStore.contactsMap.get(contactId).name
        }"`,
        okText: "Okay",
        onOk: () => {
          setIsDeletingContactId(null);
        },
      });
    }
  };

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////
  useEffect(() => {
    ContactStore.fetch();
  }, [ContactStore]);

  ///////////////////////////////////////////
  // Toolbar Cb
  ///////////////////////////////////////////
  const handleNewContactButtonClick = () => {
    history.push("/contact/new");
  };

  ///////////////////////////////////////////
  // ContactCell Cb
  ///////////////////////////////////////////
  const handleContactCellClick = (contact: Contact) => {
    if (contact.id === isDeletingContactId) {
      return;
    }

    history.push(`/contact/${contact.id}`);
  };

  const handleContactCellDeleteClick = (contact: Contact) => {
    if (!!isDeletingContactId) {
      return;
    }

    deleteContact(contact.id);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div data-testid="home-page">
      <Button type="primary" onClick={handleNewContactButtonClick}>
        New Contact
      </Button>
      <div>Number of contacts: {ContactStore.sortedContacts.length}</div>
      <div>
        {ContactStore.sortedContacts.map((contact: Contact) => (
          <ContactCell
            key={contact.id}
            isDeleting={contact.id === isDeletingContactId}
            deleteDisabled={!!isDeletingContactId}
            contact={contact}
            onClick={handleContactCellClick}
            onDeleteClick={handleContactCellDeleteClick}
          />
        ))}
      </div>
    </div>
  );
});

export default Home;
