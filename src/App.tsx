import { observer } from "mobx-react-lite";
import React from "react";
import { ColumnIndicator } from "./components/ColumnIndicator";
import { Board } from "./components/Board";
import { RowIndicator } from "./components/RowIndicator";
import { useRootStore } from "./store/store";

const App = observer(() => {
  const {
    contentHeight,
    contentWidth,
    rowIndicators,
    colIndicators,
  } = useRootStore();
  return (
    <div className="my-20">
      <h1 className="text-5xl text-center my-10">no2g AI</h1>
      <div
        id="app"
        className="mx-auto text-white bg-gray-800"
        style={{
          width: contentWidth + rowIndicators.size,
          height: contentHeight + colIndicators.size,
          fontSize: 12,
        }}
      >
        <ColumnIndicator />
        <div
          style={{ height: contentHeight }}
          className="flex flex-row"
        >
          <RowIndicator />
          <Board />
        </div>
      </div>
    </div>
  );
});

export default App;
