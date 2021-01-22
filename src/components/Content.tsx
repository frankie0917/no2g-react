import { observer } from "mobx-react-lite";
import React from "react";
import { Cell, useRootStore } from "../store/store";

export const Content = observer(() => {
  const { colIndicators, rowIndicators, current } = useRootStore();

  return (
    <div
      id="content"
      className="border-t-2 border-l-2 grid border-gray-400 bg-gray-100"
      style={{
        height: 700,
        width: 700,
        gridTemplateRows: Array(rowIndicators.value.length)
          .fill("1fr")
          .join(" "),
      }}
    >
      {rowIndicators.value.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid"
          style={{
            gridTemplateColumns: Array(colIndicators.value.length)
              .fill("1fr")
              .join(" "),
          }}
        >
          {colIndicators.value.map((cell, cellIndex) => (
            <CellItem key={cellIndex} value={current[rowIndex][cellIndex]} />
          ))}
        </div>
      ))}
    </div>
  );
});

const CellItem: React.FC<{ value: Cell }> = ({ value }) => {
  const content = () => {
    switch (value) {
      case "-":
        return <div></div>;

      case "O":
        return <div className="bg-gray-600"></div>;

      case "X":
        return <div className="text-4xl">X</div>;
    }
  };
  return <div className="h-full w-full border p-1">{content()}</div>;
};
