import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Routes from "./Routes";
import { rootStore } from "./stores";
import { Provider as MobxProvider } from "mobx-react";
import "mobx-react-lite/batchingForReactDom";

ReactDOM.render(
  <React.StrictMode>
    <MobxProvider {...rootStore.ContactStore}>
      <Routes />
    </MobxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
