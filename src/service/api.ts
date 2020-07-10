import Request from "./request";

const API = {
  contact: {
    getContacts: async () => {
      return Request.get("/contacts");
    },

    createContact: async (contactInfos: any) => {
      return Request.post("/contacts", { contactInfos: contactInfos });
    },

    getContact: async (contactId: string) => {
      return Request.get(`/contacts/${contactId}`);
    },

    updateContact: async (contactId: string, contactInfos: any) => {
      return Request.put(`/contacts/${contactId}`, {
        contactInfos: contactInfos,
      });
    },

    deleteContact: async (contactId: string) => {
      return Request.delete(`/contacts/${contactId}`);
    },
  },
};

export default API;
