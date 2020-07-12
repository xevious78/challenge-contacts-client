import { types, flow } from "mobx-state-tree";
import API from "../service/api";
import delay from "../utils/delay";

const Contact = types.frozen();

export const ContactStore = types
  .model({
    isFetching: false,

    //
    contacts: types.array(Contact),
  })
  .actions((self) => ({
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
  }));

export const initializeContactStore = () => {
  return ContactStore.create();
};
