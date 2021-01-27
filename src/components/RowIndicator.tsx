import { observer } from "mobx-react-lite";
import React from "react";
import { useRootStore } from "../store/store";
import NumberInput from "./NumberInput";

export const RowIndicator = observer(() => {
  const store = useRootStore();
  const {
    rowIndicators: { value, size },
  } = store;

  return (
    <div
      className="ml-auto w-full h-full bg-gray-700"
      style={{
        width: size,
        position: "relative",
      }}
    >
      <div
        className="h-full grid"
        style={{ gridTemplateRows: Array(value.length).fill("1fr").join(" ") }}
      >
        {value.map((row, index) => (
          <Row index={index} row={row} key={index} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          display: "block",
          transform: "translate(-50%,100%)",
        }}
        className=" text-center border-t bg-gray-600 cursor-pointer h-6 w-full"
        onClick={() => store.rowIndicators.addIndicator([1])}
      >
        添加行
      </div>
    </div>
  );
});

const Row: React.FC<{ index: number; row: number[] }> = observer(
  ({ row, index }) => {
    const store = useRootStore();
    return (
      <div
        className="flex flex-row justify-between border-t h-full"
        style={{ position: "relative" }}
      >
        <div className="bg-gray-400 w-4 h-full text-gray-600 text-center flex flex-col justify-center items-center">
          <div
            className="w-4 flex justify-center items-center bg-gray-300"
            style={{ position: "absolute", top: 0, bottom: 0, left: -17 }}
          >
            {index + 1}
          </div>
          <div
            className="flex flex-row w-full flex-1 justify-center items-center cursor-pointer text-white"
            style={{ height: 5 }}
            onClick={() => store.rowIndicators.addIndicatorCell(index)}
          >
            +
          </div>
          <div
            className="flex flex-row w-full flex-1 justify-center items-center cursor-pointer border-t text-white"
            style={{ height: 5 }}
            onClick={() => store.rowIndicators.deleteIndicator(index)}
          >
            -
          </div>
        </div>
        <div className="flex">
          {row.map((_, i) => (
            <div
              key={i}
              style={{ width: 15 }}
              className="h-full relative hover:bg-gray-400 rowGroup group overflow-hidden "
            >
              <NumberInput
                className="bg-transparent flex-1 text-center group-hover:text-gray-800 w-full h-full"
                value={row[i]}
                setValue={(val) =>
                  store.rowIndicators.setIndicatorCell(index, i, val)
                }
              />
              <div
                onClick={() => {
                  if (row.length > 1) {
                    store.rowIndicators.deleteIndicatorCell(index, i);
                  }
                }}
                className={`${
                  row.length > 1 && "xBtn"
                } bg-red-900 w-full absolute right-0 -bottom-6 flex justify-center hover:bg-red-600 z-10 cursor-pointer items-center h-3`}
              >
                x
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
