import React, { useState, createContext } from "react";

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [component, setComponent] = useState("ChooseMode");

  return (
    <HomeContext.Provider value={[component, setComponent]}>
      {children}
    </HomeContext.Provider>
  );
};
