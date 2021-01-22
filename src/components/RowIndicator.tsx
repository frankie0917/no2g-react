import { observer } from "mobx-react-lite";
import React from "react";
import { useRootStore } from "../store/store";
import NumberInput from "./NumberInput";

export const RowIndicator = observer(() => {
  const store = useRootStore();
  const {
    rowIndicators: { value },
  } = store;
  return (
    <div
      className="ml-auto w-full h-full grid bg-gray-700"
      style={{
        width: 300,
        position: "relative",
        gridTemplateRows: Array(value.length).fill("1fr").join(" "),
      }}
    >
      <div
        className="h-full border-t-2"
        style={{ gridTemplateRows: Array(value.length).fill("1fr").join(" ") }}
      >
        {value.map((row, index) => (
          <Row index={index} row={row} key={index} />
        ))}
      </div>
      <button
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          display: "block",
          transform: "translate(-50%,100%)",
        }}
        className=" text-center bg-gray-600 border-t-2 h-8 w-full"
        onClick={() => store.rowIndicators.addIndicator([1])}
      >
        添加行
      </button>
    </div>
  );
});

const Row: React.FC<{ index: number; row: number[] }> = observer(
  ({ row, index }) => {
    const store = useRootStore();
    return (
      <div className="flex flex-row justify-between h-full border-t-2">
        <div className="bg-gray-400 w-6 text-gray-600 text-center flex flex-col justify-center items-center">
          <span style={{ wordBreak: "break-word" }}>行{index}</span>
          <button
            className="w-4 flex flex-row justify-center items-center h-4 rounded-full bg-gray-700 text-white"
            onClick={() => store.rowIndicators.addIndicatorCell(index)}
          >
            +
          </button>
        </div>
        <div className="flex">
          {row.map((num, i) => (
            <NumberInput
              className="bg-transparent w-6 flex-1 text-center h-full"
              key={i}
              value={row[i]}
              setValue={(val) =>
                store.rowIndicators.setIndicatorCell(index, i, val)
              }
            />
          ))}
        </div>
      </div>
    );
  }
);
