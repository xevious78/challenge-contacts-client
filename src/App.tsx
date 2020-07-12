import React, { FunctionComponent } from "react";
import "./App.css";

type Props = {};

const App: FunctionComponent<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default App;
