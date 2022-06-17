import produce from "immer";

// State
export interface Game {
  code: string;
  language: string;
}

export const init: Game = {
  code: "",
  language: "",
};

export type Action = {
  type: "INITIALIZE_GAME";
  payload: { code: string; language: string };
};

export const reduce = (prev: Game, action: Action): Game => {
  switch (action.type) {
    case "INITIALIZE_GAME": {
      return produce(prev, (draft) => {
        draft.code = action.payload.code;
        draft.language = action.payload.language;
      });
    }
  }
};
