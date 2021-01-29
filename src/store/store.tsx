import { makeAutoObservable, toJS } from "mobx";
import { createContext, PropsWithChildren, useContext } from "react";

export type Cell = "O" | "X" | "-";

export type Board = Cell[][];

export type IndicatorType = "row" | "col";

export const minIdicatorSize = 40;

export const minIdicatorCellSize = 16;

interface IndicatorProp {
  parent: RootStore;
  type: IndicatorType;
  value?: number[][];
}

export class Indicator {
  constructor(prop: IndicatorProp) {
    makeAutoObservable(this);
    this.parent = prop.parent;
    this.type = prop.type;
    if (prop.value) {
      for (const row of prop.value) {
        this.addIndicator(row);
      }
    }
  }
  size: number = 100;
  maxCellSize: number = 0;
  parent: RootStore;
  type: IndicatorType;
  value: number[][] = [];

  addIndicator(val: number[]) {
    if (this.parent.playing) return;
    if (this.type === "row") {
      this.parent.addRowToCurrent();
    } else {
      this.parent.addColToCurrent();
    }

    if (this.value.length > 9) {
      if (this.type === "row") {
        this.parent.contentHeight += minIdicatorSize;
      } else {
        this.parent.contentWidth += minIdicatorSize;
      }
    }
    this.value.push(val);
  }

  deleteIndicator(index: number) {
    if (this.parent.playing) return;
    if (this.type === "row") {
      this.parent.deleteRowToCurrent(index);
    } else {
      this.parent.deleteColToCurrent(index);
    }

    if (this.value.length > 9) {
      if (this.type === "row") {
        this.parent.contentHeight -= minIdicatorSize;
      } else {
        this.parent.contentWidth -= minIdicatorSize;
      }
    }
    this.value.splice(index, 1);
  }

  addIndicatorCell(Index: number) {
    if (this.parent.playing) return;
    this.value[Index].push(1);
    this.maxCellSize = Math.max(this.maxCellSize, this.value[Index].length);

    if (this.maxCellSize > 5) {
      this.size += minIdicatorCellSize;
    }
  }

  deleteIndicatorCell(index: number, cellIndex: number) {
    if (this.parent.playing) return;
    this.value[index].splice(cellIndex, 1);
    this.maxCellSize = Math.max(this.maxCellSize, this.value[index].length);

    if (this.maxCellSize > 5) {
      if (this.size - minIdicatorCellSize > 100) {
        this.size -= minIdicatorCellSize;
      } else {
        this.size = 100;
      }
    }
  }

  setIndicatorCell(Index: number, cellIndex: number, value: number) {
    if (this.parent.playing) return;
    this.value[Index][cellIndex] = value;
  }
}

function boardToIndicators(board: Board) {
  let colIndicator: number[][] = [];
  let rowIndicator: number[][] = [];

  for (const [rowIndex, row] of board.entries()) {
    for (const [cellIndex, cell] of row.entries()) {
      if (!colIndicator[cellIndex]) {
        colIndicator[cellIndex] = [];
      }

      if (!rowIndicator[rowIndex]) {
        rowIndicator[rowIndex] = [];
      }

      const currentCol = colIndicator[cellIndex];
      const currentRow = rowIndicator[rowIndex];

      if (cell === "O") {
        if (rowIndex === 0) {
          currentCol.push(1);
        }

        if (rowIndex > 0) {
          currentCol[currentCol.length - 1] += 1;
        }

        if (cellIndex === 0) {
          currentRow.push(1);
        }

        if (cellIndex > 0) {
          currentRow[currentRow.length - 1] += 1;
        }
      } else {
        currentCol.push(0);
        currentRow.push(0);
      }
    }
  }

  for (const [colIndex, currentCol] of colIndicator.entries()) {
    colIndicator[colIndex] = currentCol.filter((it) => it !== 0);
    if (colIndicator[colIndex].length === 0) {
      colIndicator[colIndex].push(0);
    }
  }

  for (const [rowIndex, currentRow] of rowIndicator.entries()) {
    rowIndicator[rowIndex] = currentRow.filter((it) => it !== 0);
    if (rowIndicator[rowIndex].length === 0) {
      rowIndicator[rowIndex].push(0);
    }
  }
  return {
    rowIndicator,
    colIndicator,
  };
}

export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }
  contentHeight: number = 500;
  contentWidth: number = 500;

  currentRows: number = 0;
  currentCols: number = 0;
  current: Board = [];
  success: Board = [];
  colIndicators: Indicator = new Indicator({
    parent: this,
    type: "col",
    value: [
      [4],
      [4, 1],
      [7, 3],
      [2, 4, 1, 2],
      [1, 4, 2, 1],
      [1, 5, 1, 1],
      [1, 4, 2, 1],
      [1, 4, 1, 1],
      [2, 2, 1, 2, 1],
      [3, 1, 1, 1],
      [3, 1, 2, 1],
      [1, 1, 1, 1, 2],
      [6, 1, 3],
      [1, 2, 4, 1],
      [4],
    ],
  });
  rowIndicators: Indicator = new Indicator({
    parent: this,
    type: "row",
    value: [
      [2, 1],
      [2, 2, 1],
      [1, 5],
      [1, 2, 2],
      [1, 6],
      [4, 2, 1],
      [7, 2],
      [7, 1],
      [8, 3],
      [3, 2, 2, 2],
      [1, 1],
      [1, 3, 3, 3, 1],
      [3, 3, 3, 3],
      [2, 2],
      [9],
    ],
  });

  rowValueToIndicator: number[][] = [];
  colValueToIndicator: number[][] = [];

  playing = false;

  setBoard(num: number) {
    for (let i = 0; i < num; i++) {
      this.rowIndicators.addIndicator([1]);
      this.colIndicators.addIndicator([1]);
    }
  }

  solve() {
    const generateArrangement = (
      indicator: number[],
      width: number
    ): Cell[][] => {
      if (indicator.includes(0)) return [Array(width).fill("-")];
      if (indicator[0] > width) return [];

      const spaces = width - indicator[0]; //spaces = 2 means possible starting indexes are [0,1,2]
      if (indicator.length === 1) {
        //this is special case
        const arr = [];
        for (let i = 0; i < spaces + 1; i++) {
          arr.push([
            ...Array(i).fill("-"),
            ...Array(indicator[0]).fill("O"),
            ...Array(spaces - i).fill("-"),
          ]);
        }
        return arr;
      }

      const ans = [];
      for (let i = 0; i < spaces; i++) {
        const list = generateArrangement(indicator.slice(1), spaces - i - 1);
        for (let j = 0; j < list.length; j++) {
          ans.push([
            ...Array(i).fill("-"),
            ...Array(indicator[0]).fill("O"),
            "-",
            ...list[j],
          ]);
        }
      }

      return ans;
    };
    // generate arragements
    const arrangements: Cell[][][] = [];

    for (const [rowIndex] of this.current.entries()) {
      arrangements[rowIndex] = generateArrangement(
        this.rowIndicators.value[rowIndex],
        this.current[0].length
      );
    }
    console.log('arrangements',arrangements)

    const verifyBoard = (board: Board) => {
      // generate col indicator
      let colIndicator: number[][] = [];

      for (const [rowIndex, row] of board.entries()) {
        for (const [cellIndex, cell] of row.entries()) {
          if (!colIndicator[cellIndex]) {
            colIndicator[cellIndex] = [];
          }

          const currentCol = colIndicator[cellIndex];

          if (cell === "O") {
            if (rowIndex === 0) {
              currentCol.push(1);
            }

            if (rowIndex > 0) {
              currentCol[currentCol.length - 1] += 1;
            }
          } else {
            currentCol.push(0);
          }
        }
      }

      for (const [colIndex, currentCol] of colIndicator.entries()) {
        colIndicator[colIndex] = currentCol.filter((it) => it !== 0);
        if (colIndicator[colIndex].length === 0) {
          colIndicator[colIndex].push(0);
        }
      }

      // validate each col
      for (const [i, col] of colIndicator.entries()) {
        if (
          JSON.stringify(this.colIndicators.value[i]) !== JSON.stringify(col)
        ) {
          return false;
        }
      }

      return true;
    };

    // validate
    const validate = (set: number[]): Board | false => {
      console.log("set", set);
      const board: Board = [];
      for (const [i, num] of set.entries()) {
        board.push(arrangements[i][num]);
      }
      if (verifyBoard(board)) {
        return board;
      }
      let changeDepth = 0;
      let nextSet: number[] = [];
      for (let i = set.length - 1; i >= 0; i--) {
        nextSet[i] = set[i];
        if (
          set[i + 1] === undefined ||
          set[i + 1] === arrangements[i + 1].length - 1
        ) {
          if (i === 0 && set[i] === arrangements[0].length - 1) {
            return false;
          }
          if (changeDepth + i === set.length - 1) {
            nextSet[i] = set[i] + 1;
          }
          if (set[i] === arrangements[i].length - 1) {
            nextSet[i] = 0;
          }
          changeDepth++;
        }
      }
      return validate(nextSet);
    };
    const res = validate(Array(arrangements.length).fill(0));

    if (res !== false) {
      for (const [rowIndex, row] of res.entries()) {
        for (const [cellIndex, cell] of row.entries()) {
          this.setCurrentCell(rowIndex, cellIndex, cell);
        }
      }
    } else {
      alert("无解法");
    }
  }

  addRowToCurrent(cell?: Cell) {
    if (this.playing) return;

    this.currentRows++;

    this.current.push(Array(this.currentCols).fill(cell || "-"));
  }

  addColToCurrent(cell?: Cell) {
    if (this.playing) return;

    this.currentCols++;
    for (const row of this.current) {
      row.push(cell || "-");
    }
  }

  deleteRowToCurrent(index: number) {
    if (this.playing) return;

    this.currentRows--;
    this.current.splice(index, 1);
  }

  deleteColToCurrent(index: number) {
    if (this.playing) return;

    this.currentCols--;
    for (const row of this.current) {
      row.splice(index, 1);
    }
  }

  setCurrentCell(rowIndex: number, colIndex: number, value: Cell) {
    this.current[rowIndex][colIndex] = value;
    const { colIndicator, rowIndicator } = boardToIndicators(this.current);
    this.rowValueToIndicator = rowIndicator;
    this.colValueToIndicator = colIndicator;
  }
}

export const RootStoreContext = createContext<RootStore>(new RootStore());

export const RootStoreProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => useContext(RootStoreContext);
