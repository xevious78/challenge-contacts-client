import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../stores";
import { Contact } from "../types";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "antd";
import API from "../service/api";
import { ContactStoreFetchError } from "../stores/ContactStore";
import styles from "./HomePage.module.scss";
import ClassName from "../utils/classname";
import { LoadingOutlined } from "@ant-design/icons";
import ContactList from "../components/Contact/List/ContactList";

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
    if (!ContactStore.hasFetched) {
      ContactStore.fetch();
    }
  }, [ContactStore]);

  useEffect(() => {
    if (ContactStore.fetchError === ContactStoreFetchError.OTHER_ERROR) {
      Modal.error({
        title: "An error occured while fetching the contacts",
        okText: "Retry",
        onOk: () => {
          ContactStore.fetch();
        },
      });
    }
  }, [ContactStore, ContactStore.fetchError]);

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
  const cn = ClassName(styles, "home-page");
  const toolbarCn = ClassName(styles, "home-page-toolbar");

  const renderTitle = () => {
    if (ContactStore.isFetching) {
      return <span>Loading contacts...</span>;
    }

    return `${ContactStore.sortedContacts.length} contact${
      ContactStore.sortedContacts.length !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className={cn()} data-testid="home-page">
      <div className="toolbar">
        <div className={toolbarCn()}>
          <h3 className={toolbarCn("title")}>{renderTitle()}</h3>

          <div className={toolbarCn("butons")}>
            <Button type="primary" onClick={handleNewContactButtonClick}>
              New Contact
            </Button>
          </div>
        </div>
      </div>
      <div className="container">
        {ContactStore.isFetching ? (
          <div className={cn("loading-container")}>
            <LoadingOutlined spin />
          </div>
        ) : (
          <div className={cn("contacts")}>
            <ContactList
              isDeletingContactId={isDeletingContactId}
              onContactCellClick={handleContactCellClick}
              onContactCellDeleteClick={handleContactCellDeleteClick}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default Home;
