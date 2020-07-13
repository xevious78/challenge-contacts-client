import React from "react";

export const ContactFormContext = React.createContext({
  isLoading: false,
  disabled: false,
});

export function useContactFormContext() {
    const context = React.useContext(ContactFormContext);
    if (context === null) {
      throw new Error("Context cannot be null, please add a context provider");
    }
    return context;
  }
  