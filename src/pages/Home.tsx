import React, { useEffect } from "react";
import { observer, useObserver } from "mobx-react";
import { useStores } from "../stores";
import ContactCell from "../components/Contact/ContactCell";
import { Contact } from "../types";
import { useHistory } from "react-router-dom";

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
