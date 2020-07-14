import { types, flow } from "mobx-state-tree";
import API from "../service/api";
import { Contact } from "../types";

const ContactModel = types.frozen();

export enum ContactStoreFetchError {
  NO_ERROR = 0,
  OTHER_ERROR,
}

export const ContactStore = types
  .model({
    isFetching: false,
    hasFetched: false,
    fetchError: ContactStoreFetchError.NO_ERROR,

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
      self.fetchError = ContactStoreFetchError.NO_ERROR;
      self.isFetching = true;
      self.hasFetched = false;

      try {
        const response = yield API.contact.getContacts();
        self.contactsMap.clear();
        response.data.contacts.forEach((contact: Contact) =>
          self.contactsMap.set(contact.id, contact)
        );
        self.hasFetched = true;
      } catch (e) {
        self.fetchError = ContactStoreFetchError.OTHER_ERROR;
      } finally {
        self.isFetching = false;
      }
    }),

    ///////////////////////////////////////////
    // Modify Store
    ///////////////////////////////////////////
    /* Insert contact*/
    addContact: (contact: Contact) => {
      if (self.contactsMap.get(contact.id)) {
        return;
      }

      self.contactsMap.set(contact.id, contact);
    },

    /* Remove contact */
    removeContact: (contactId: string) => {
      self.contactsMap.delete(contactId);
    },

    updateContact: (contact: Contact) => {
      if (!self.contactsMap.get(contact.id)) {
        return;
      }

      self.contactsMap.set(contact.id, contact);
    },
  }));

export const initializeContactStore = () => {
  return ContactStore.create();
};
