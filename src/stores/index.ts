import React from "react";
import { initializeContactStore, ContactStore } from "./contacts";
import { types } from "mobx-state-tree";
import 'mobx-react-lite/batchingForReactDom'

export const RootStore = types.model({
  ContactStore: ContactStore,
});

export const rootStore = {
  ContactStore: initializeContactStore(),
};

export const RootStoreContext = React.createContext(rootStore);

export function useStores() {
  const store = React.useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
