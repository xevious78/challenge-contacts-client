import { types, flow } from "mobx-state-tree";
import API from "../service/api";
import delay from "../utils/delay";
import { Contact } from "../types";

const ContactModel = types.frozen();

export const ContactStore = types
  .model({
    isFetching: false,

    //
    contactsMap: types.map(ContactModel),
  })
  .views((self) => ({
    get sortedContacts() {
      const contacts: Array<Contact> = [];
      self.contactsMap.forEach((contact: Contact) => contacts.push(contact));
      contacts.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
      return contacts;
    },
  }))
  .actions((self) => ({
    ///////////////////////////////////////////
    // Network
    ///////////////////////////////////////////
    /* Fetch contacts from server */
    fetch: flow(function* () {
      self.isFetching = true;
      yield delay(2000);

      try {
        const response = yield API.contact.getContacts();
        response.data.contacts.forEach((contact: Contact) =>
          self.contactsMap.set(contact.id, contact)
        );
      } catch (e) {
        //TODO: Error
      } finally {
        self.isFetching = false;
      }
    }),

    ///////////////////////////////////////////
    // Modify Store
    ///////////////////////////////////////////
    /* Insert contact*/
    addContact: (contact: Contact) => {
      self.contactsMap.set(contact.id, contact);
    },

    /* Remove contact */
    removeContact: (contactId: string) => {
      self.contactsMap.delete(contactId);
    },
  }));

export const initializeContactStore = () => {
  return ContactStore.create();
};
