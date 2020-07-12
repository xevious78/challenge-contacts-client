import React, { useEffect } from "react";
import { observer, useObserver } from "mobx-react";
import { useStores } from "../stores";
import ContactCell from "../components/Contact/ContactCell";
import { Contact } from "../types";
import { useHistory } from "react-router-dom";
import { Button } from "antd";

const Home = observer(() => {
  const history = useHistory();
  const { ContactStore } = useStores();

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
    history.push(`/contact/${contact.id}`);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div data-testid="home-page">
      <Button type="primary" onClick={handleNewContactButtonClick}>
        New Contact
      </Button>
      <div>Number of contacts: {ContactStore.contacts.length}</div>
      <div>
        {ContactStore.contacts.map((contact: Contact) => (
          <ContactCell
            key={contact.id}
            contact={contact}
            onClick={handleContactCellClick}
          />
        ))}
      </div>
    </div>
  );
});

export default Home;
