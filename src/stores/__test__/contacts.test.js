import { initializeContactStore } from "../contacts";
import API from "../../service/api";

describe("ContactStore", () => {
  const setup = () => {
    return initializeContactStore();
  };

  describe("addContact", () => {
    it("should add the given contact to the store", () => {
      const store = setup();

      store.addContact({ id: "test", name: "name" });

      expect(store.contactsMap.get("test")).toEqual({
        id: "test",
        name: "name",
      });
    });

    it("should do nothing if the contact already exists in the store", () => {
      const store = setup();
      store.addContact({ id: "test", name: "name" });

      store.addContact({ id: "test", name: "newName" });

      expect(store.contactsMap.get("test")).toEqual({
        id: "test",
        name: "name",
      });
    });
  });

  describe("removeContact", () => {
    it("should remove the given contact from the store", () => {
      const store = setup();
      store.addContact({ id: "test", name: "name" });

      store.removeContact("test");

      expect(store.contactsMap.get("test")).toEqual(undefined);
    });
  });

  describe("updateContact", () => {
    it("should update the given contact from the store", () => {
      const store = setup();
      store.addContact({ id: "test", name: "name" });

      store.updateContact({ id: "test", name: "newName" });

      expect(store.contactsMap.get("test")).toEqual({
        id: "test",
        name: "newName",
      });
    });

    it("should do nothing is the given contact does not exist in the store", () => {
      const store = setup();

      store.updateContact({ id: "test", name: "name" });

      expect(store.contactsMap.get("test")).toEqual(undefined);
    });
  });

  describe("sortedContacts", () => {
    it("should sort the contacts by alphebetical order of name", () => {
      const store = setup();
      store.addContact({ id: "234", name: "C" });
      store.addContact({ id: "123", name: "A" });
      store.addContact({ id: "321", name: "B" });

      const contacts = store.sortedContacts;
      expect(contacts).toEqual([
        { id: "123", name: "A" },
        { id: "321", name: "B" },
        { id: "234", name: "C" },
      ]);
    });
  });

  describe("fetch", () => {
    it("should get the contacts from the API", async () => {
      API.contact.getContacts = jest.fn(() =>
        Promise.resolve({
          data: {
            contacts: [
              { id: "1", name: "a" },
              { id: "2", name: "b" },
            ],
          },
        })
      );
      const store = setup();

      await store.fetch();

      expect(store.contactsMap.size).toBe(2);
      expect(store.contactsMap.get("1")).toEqual({ id: "1", name: "a" });
      expect(store.contactsMap.get("2")).toEqual({ id: "2", name: "b" });
    });

    it("should update isFetching", async () => {
      API.contact.getContacts = jest.fn(() =>
        Promise.resolve({
          data: {
            contacts: [],
          },
        })
      );
      const store = setup();

      const fetchPromise = store.fetch();
      expect(store.isFetching).toBeTruthy();

      await fetchPromise;
      expect(store.isFetching).toBeFalsy();
    });

    it("should update isFetching after an error", async () => {
      API.contact.getContacts = jest.fn(() => Promise.reject());
      const store = setup();

      const fetchPromise = store.fetch();
      expect(store.isFetching).toBeTruthy();

      await fetchPromise;
      expect(store.isFetching).toBeFalsy();
    });
  });
});
