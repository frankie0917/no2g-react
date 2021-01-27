import { makeAutoObservable } from "mobx";
import { createContext, PropsWithChildren, useContext } from "react";

export type Cell = "O" | "X" | "-";

export type Board = Cell[][];

export type IndicatorType = "row" | "col";

export const minIdicatorSize = 40;

export const minIdicatorCellSize = 16;

export class Indicator {
  constructor(parent: RootStore, type: IndicatorType) {
    makeAutoObservable(this);
    this.parent = parent;
    this.type = type;
  }
  size: number = 100;
  maxCellSize: number = 0;
  parent: RootStore;
  type: IndicatorType;
  value: number[][] = [];

  addIndicator(val: number[]) {
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
    this.value[Index].push(1);
    this.maxCellSize = Math.max(this.maxCellSize, this.value[Index].length);

    if (this.maxCellSize > 5) {
      this.size += minIdicatorCellSize;
    }
  }

  deleteIndicatorCell(index: number, cellIndex: number) {
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
    this.value[Index][cellIndex] = value;
  }
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
  colIndicators: Indicator = new Indicator(this, "col");
  rowIndicators: Indicator = new Indicator(this, "row");

  addRowToCurrent(cell?: Cell) {
    this.currentRows++;

    this.current.push(Array(this.currentCols).fill(cell || "-"));
  }

  addColToCurrent(cell?: Cell) {
    this.currentCols++;
    for (const row of this.current) {
      row.push(cell || "-");
    }
  }

  deleteRowToCurrent(index: number) {
    this.currentRows--;
    this.current.splice(index, 1);
  }

  deleteColToCurrent(index: number) {
    this.currentCols--;
    for (const row of this.current) {
      row.splice(index, 1);
    }
  }

  setCurrentCell(rowIndex: number, colIndex: number, value: Cell) {
    this.current[rowIndex][colIndex] = value;
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
