import { observer } from "mobx-react-lite";
import React from "react";
import { Cell, useRootStore } from "../store/store";

export type Mode = "preview" | "normal";

export const Board: React.FC<{ mode?: Mode }> = observer(({ mode }) => {
  const {
    colIndicators,
    rowIndicators,
    current,
    contentWidth,
    contentHeight,
  } = useRootStore();
  return (
    <div
      id="content"
      className="border-t border-l grid border-gray-400 bg-gray-100"
      style={{
        height: mode === "preview" ? contentHeight / 3 : contentHeight,
        width: mode === "preview" ? contentWidth / 3 : contentWidth,
        gridTemplateRows: Array(rowIndicators.value.length)
          .fill("1fr")
          .join(" "),
      }}
    >
      {rowIndicators.value.map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid"
          style={{
            gridTemplateColumns: Array(colIndicators.value.length)
              .fill("1fr")
              .join(" "),
          }}
        >
          {colIndicators.value.map((_, cellIndex) => (
            <CellItem
              key={cellIndex}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
              mode={mode || "normal"}
              value={current[rowIndex][cellIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

const CellItem: React.FC<{
  value: Cell;
  rowIndex: number;
  cellIndex: number;
  mode: Mode;
}> = observer(({ value, cellIndex, rowIndex, mode }) => {
  const store = useRootStore();

  const className = " w-full h-full";

  return (
    <div
      className={`${
        mode === "normal" && "border"
      } h-full w-full cursor-pointer`}
      onClick={() => {
        store.setCurrentCell(
          rowIndex,
          cellIndex,
          value === "-" ? "O" : value === "O" ? "X" : "-"
        );
      }}
    >
      {value === "-" ? (
        <div className={className}></div>
      ) : value === "O" ? (
        <div className={"bg-gray-600" + className}></div>
      ) : (
        <div
          style={{ fontSize: mode === "normal" ? 25 : 10 }}
          className={
            "flex justify-center items-center text-gray-600" + className
          }
        >
          X
        </div>
      )}
    </div>
  );
});
