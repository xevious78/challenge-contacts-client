import { types, flow } from "mobx-state-tree";
import API from "../service/api";
import delay from "../utils/delay";
import { Contact } from "../types";

const ContactModel = types.frozen();

export const ContactStore = types
  .model({
    isFetching: false,

    //
    contacts: types.array(ContactModel),
  })
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
        self.contacts = response.data.contacts;
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
      self.contacts.push(contact);
      self.contacts.sort((a: Contact, b: Contact) =>
        a.name.toLocaleUpperCase().localeCompare(b.name.toLocaleUpperCase())
      );
    },
  }));

export const initializeContactStore = () => {
  return ContactStore.create();
};
