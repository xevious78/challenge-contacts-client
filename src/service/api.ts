import Request, { URLJoin } from "./request";
import { Contact, ContactInfos } from "../types";
import axios, { AxiosRequestConfig } from "axios";

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

interface UploadImageData {
  imageId: string;
}

const API = {
  image: {
    uploadImage: async (image: File, config?: AxiosRequestConfig) => {
      const formData = new FormData();
      formData.append("image", image);
      return Request.post<UploadImageData>("/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        ...config,
      });
    },

    getImageURL: (imageId: string) => {
      return URLJoin("image", imageId);
    },
  },
  contact: {
    getContacts: async (config?: AxiosRequestConfig) => {
      return Request.get<GetContactsData>("/contacts", { ...config });
    },

    createContact: async (
      contactInfos: ContactInfos,
      config?: AxiosRequestConfig
    ) => {
      return Request.post<CreateContactData>("/contacts", {
        contactInfos: contactInfos,
      });
    },

    getContact: async (contactId: string, config?: AxiosRequestConfig) => {
      return Request.get<GetContactData>(`/contacts/${contactId}`, {
        ...config,
      });
    },

    updateContact: async (
      contactId: string,
      contactInfos: ContactInfos,
      config?: AxiosRequestConfig
    ) => {
      return Request.put<UpdateContactData>(
        `/contacts/${contactId}`,
        {
          contactInfos: contactInfos,
        },
        { ...config }
      );
    },

    deleteContact: async (contactId: string, config?: AxiosRequestConfig) => {
      return Request.delete<DeleteContactData>(`/contacts/${contactId}`, {
        ...config,
      });
    },
  },
};

export const CancelToken = axios.CancelToken;

export default API;
