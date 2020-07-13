import React from "react";
import { initializeContactStore, ContactStore } from "./ContactStore";
import { types } from "mobx-state-tree";
import "mobx-react-lite/batchingForReactDom";
import { UIStore, initializeUIStore } from "./UIStore";

export const RootStore = types.model({
  ContactStore: ContactStore,
  UIStore: UIStore,
});

export const rootStore = {
  ContactStore: initializeContactStore(),
  UIStore: initializeUIStore(),
};

export const RootStoreContext = React.createContext(rootStore);

export function useStores() {
  const store = React.useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
