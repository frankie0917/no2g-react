import { makeAutoObservable, toJS } from "mobx";
import { Instance, types } from "mobx-state-tree";
import { createContext, PropsWithChildren, useContext } from "react";

// export type Cell = "O" | "X" | "-";

// export type Board = Cell[][];

// export class Indicator {
//   constructor() {
//     makeAutoObservable(this);
//   }

//   value: number[][] = [];

//   addIndicator(value: number[]) {
//     this.value.push(value);
//   }

//   setIndicator(index: number, value: number[]) {
//     this.value[index] = value;
//   }

//   addIndicatorCell(Index: number) {
//     this.value[Index].push(1);
//   }

//   setIndicatorCell(Index: number, cellIndex: number, value: number) {
//     this.value[Index][cellIndex] = value;
//   }
// }

const Indicator = types.model('indicator',{
  value: types.array(types.array(types.number))
})

const Cell = types.union([types.string()])

const Board = types
  .model("board", {
    value: ,
  })
  .actions((self) => ({
    addRow() {
      self.value.push([]);
    },
  }));

const RootStore = types.model("rootStore", {
  current: Board,
});

// export class RootStore {
//   constructor() {
//     makeAutoObservable(this);
//   }
//   current: Board = [];
//   success: Board = [];
//   colIndicators: Indicator = new Indicator();
//   rowIndicators: Indicator = new Indicator();
// }

interface IRootStore extends Instance<typeof RootStore> {}

export const RootStoreContext = createContext<IRootStore>({} as IRootStore);

export const RootStoreProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <RootStoreContext.Provider value={RootStore.create()}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => useContext(RootStoreContext);
