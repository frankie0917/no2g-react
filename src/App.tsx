import { observer } from "mobx-react-lite";
import React from "react";
import { ColumnIndicator } from "./components/ColumnIndicator";
import { Content } from "./components/Content";
import { RowIndicator } from "./components/RowIndicator";
import { RootStoreProvider } from "./store/store";

const App = observer(() => {
  return (
    <RootStoreProvider>
      <h1 className="text-5xl text-center my-5">no2g AI</h1>
      <div
        id="app"
        className="mx-auto text-white bg-gray-800"
        style={{ width: 1000, height: 1000 }}
      >
        <ColumnIndicator />
        <div style={{ height: 700 }} className="flex flex-row">
          <RowIndicator />
          <Content />
        </div>
      </div>
    </RootStoreProvider>
  );
});

export default App;
