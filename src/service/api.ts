import Request from "./request";
import { Contact, ContactInfos } from "../types";

interface GetContactsData {
  contacts: Array<Contact>;
}

interface CreateContactData {
  contact: Contact;
}

interface GetContactData {
  contact: Contact;
}

interface UpdateContactData {
  contact: Contact;
}

interface DeleteContactData {
  contact: Contact;
}

const API = {
  contact: {
    getContacts: async () => {
      return Request.get<GetContactsData>("/contacts");
    },

    createContact: async (contactInfos: ContactInfos) => {
      return Request.post<CreateContactData>("/contacts", {
        contactInfos: contactInfos,
      });
    },

    getContact: async (contactId: string) => {
      return Request.get<GetContactData>(`/contacts/${contactId}`);
    },

    updateContact: async (contactId: string, contactInfos: ContactInfos) => {
      return Request.put<UpdateContactData>(`/contacts/${contactId}`, {
        contactInfos: contactInfos,
      });
    },

    deleteContact: async (contactId: string) => {
      return Request.delete<DeleteContactData>(`/contacts/${contactId}`);
    },
  },
};

export default API;
