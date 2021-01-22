import { makeAutoObservable, toJS } from "mobx";
import { types } from "mobx-state-tree";
import { createContext, PropsWithChildren, useContext } from "react";

export type Cell = "O" | "X" | "-";

export type Board = Cell[][];

export class Indicator {
  constructor() {
    makeAutoObservable(this);
  }

  value: number[][] = [];

  addIndicator(value: number[]) {

    this.value.push(value);
  }

  setIndicator(index: number, value: number[]) {
    this.value[index] = value;
  }

  addIndicatorCell(Index: number) {
    this.value[Index].push(1);
  }

  setIndicatorCell(Index: number, cellIndex: number, value: number) {
    this.value[Index][cellIndex] = value;
  }
}

export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }
  current: Board = [];
  success: Board = [];
  colIndicators: Indicator = new Indicator();
  rowIndicators: Indicator = new Indicator();
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
