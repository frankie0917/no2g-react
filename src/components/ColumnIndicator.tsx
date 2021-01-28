import { observer } from "mobx-react-lite";
import React, { useMemo, useState } from "react";
import { useRootStore } from "../store/store";
import { Board } from "./Board";
import NumberInput from "./NumberInput";

export const ColumnIndicator = observer(() => {
  const store = useRootStore();
  const {
    colIndicators: { value, size },
    rowIndicators,
    contentWidth,
  } = store;
  const [preview, setPreview] = useState(false);

  return (
    <div className="flex flex-row relative" style={{ height: size }}>
      <div
        style={{ width: rowIndicators.size }}
        className="flex justify-center items-center relative"
        onMouseEnter={() => setPreview(true)}
        onMouseLeave={() => setPreview(false)}
      >
        预览
        {preview && (
          <div
            className="absolute bottom-1/2 z-20 right-1/2 border-2 border-red-400"
            style={{ transform: "translate(100%,100%)" }}
          >
            <Board mode="preview" />
          </div>
        )}
      </div>
      <div
        className="h-full grid bg-gray-700"
        style={{
          width: contentWidth,
          gridTemplateColumns: Array(value.length).fill("1fr").join(" "),
        }}
      >
        {value.map((v, i) => (
          <Col value={v} index={i} key={i} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translate(100%,-50%)",
        }}
        className="cursor-pointer text-center flex flex-row items-center justify-center bg-gray-600 border-l w-6 h-full"
        onClick={() => store.colIndicators.addIndicator([1])}
      >
        添加列
      </div>
    </div>
  );
});

const Col: React.FC<{ value: number[]; index: number }> = observer(
  ({ value, index }) => {
    const store = useRootStore();
    const current = store.colValueToIndicator[index];
    const isValid = useMemo(() => {
      return JSON.stringify(current) === JSON.stringify(value);
    }, [current, value]);
    return (
      <div
        className={`${isValid && "bg-gray-500"} border-l flex flex-col`}
        style={{ position: "relative" }}
      >
        <div className="bg-gray-400 text-gray-600 text-center flex flex-row items-center">
          <div
            className="h-4 flex justify-center items-center bg-gray-300"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -17,
            }}
          >
            {index + 1}
          </div>
          <div
            className="flex flex-row flex-1 justify-center items-center cursor-pointer h-full text-white"
            onClick={() => store.colIndicators.addIndicatorCell(index)}
          >
            +
          </div>
          <div
            className="flex flex-row flex-1 justify-center items-center cursor-pointer h-full border-l text-white"
            onClick={() => store.colIndicators.deleteIndicator(index)}
          >
            -
          </div>
        </div>
        <div className="flex flex-col justify-end mt-auto">
          {value.map((_, i) => (
            <div
              key={i}
              style={{ height: 15 }}
              className="flex flex-row hover:bg-gray-400 group overflow-hidden relative colGroup"
            >
              <NumberInput
                key={i}
                value={store.colIndicators.value[index][i]}
                setValue={(val) =>
                  store.colIndicators.setIndicatorCell(index, i, val)
                }
                className="bg-transparent text-center group-hover:text-gray-800 w-full h-full"
              />
              <div
                onClick={() => {
                  if (value.length > 1) {
                    store.colIndicators.deleteIndicatorCell(index, i);
                  }
                }}
                className={`${
                  value.length > 1 && "xBtn"
                } bg-red-900 w-3 absolute -right-6 flex justify-center hover:bg-red-600 z-10 cursor-pointer items-center h-full`}
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
