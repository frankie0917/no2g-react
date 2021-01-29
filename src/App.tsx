import { observer } from "mobx-react-lite";
import React from "react";
import { Board } from "./components/Board";
import { ColumnIndicator } from "./components/ColumnIndicator";
import { RowIndicator } from "./components/RowIndicator";
import { useRootStore } from "./store/store";

const App = observer(() => {
  const store = useRootStore();
  const {
    contentHeight,
    contentWidth,
    rowIndicators,
    colIndicators,
    playing,
  } = store;
  return (
    <div className="my-20">
      <h1 className="text-5xl text-center my-10">no2g AI</h1>
      <div className="my-10 flex flex-row justify-center items-center">
        <div
          onClick={() => {
            store.solve();
          }}
          className="bg-green-700 text-white p-4 w-24 flex cursor-pointer justify-center items-center"
        >
          {playing ? "进行中" : "开始"}
        </div>
      </div>
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
        <div style={{ height: contentHeight }} className="flex flex-row">
          <RowIndicator />
          <Board />
        </div>
      </div>
    </div>
  );
});

export default App;
