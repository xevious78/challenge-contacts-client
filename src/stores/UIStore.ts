import { types } from "mobx-state-tree";

export const UIStore = types
  .model({
    contactListScrollOffset: 0,
  })
  .actions((self) => ({
    setContactListScrollOffset: (value: number) => {
      self.contactListScrollOffset = value;
    },
  }));

export const initializeUIStore = () => {
  return UIStore.create();
};
