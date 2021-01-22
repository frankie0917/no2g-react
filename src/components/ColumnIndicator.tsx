import { observer } from "mobx-react-lite";
import React from "react";
import { useRootStore } from "../store/store";
import NumberInput from "./NumberInput";

export const ColumnIndicator = observer(() => {
  const store = useRootStore();
  const {
    colIndicators: { value },
  } = store;

  return (
    <div
      className="flex flex-row"
      style={{ height: 300, position: "relative" }}
    >
      <div
        className="ml-auto w-full h-full grid border-l-2 bg-gray-700"
        style={{
          width: 700,
          gridTemplateColumns: Array(value.length).fill("1fr").join(" "),
        }}
      >
        {value.map((v, i) => (
          <Col value={v} index={i} key={i} />
        ))}
      </div>
      <button
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          display: "block",
          transform: "translate(100%,-50%)",
        }}
        className=" text-center bg-gray-600 border-l-2 w-8 h-full"
        onClick={() => store.colIndicators.addIndicator([1])}
      >
        添加列
      </button>
    </div>
  );
});

const Col: React.FC<{ value: number[]; index: number }> = observer(
  ({ value, index }) => {
    const store = useRootStore();
    return (
      <div className="border-r flex flex-col">
        <div className="bg-gray-400 text-gray-600 text-center flex flex-row justify-center items-center">
          <span>列:{index}</span>
          <button
            className="w-4 ml-2 flex flex-row justify-center items-center h-4 rounded-full bg-gray-700 text-white"
            onClick={() => store.colIndicators.addIndicatorCell(index)}
          >
            +
          </button>
        </div>
        <div className="flex flex-col justify-end mt-auto">
          {value.map((num, i) => (
            <NumberInput
              key={i}
              value={store.colIndicators.value[index][i]}
              setValue={(val) =>
                store.colIndicators.setIndicatorCell(index, i, val)
              }
              className="bg-transparent text-center w-full"
            />
          ))}
        </div>
      </div>
    );
  }
);
