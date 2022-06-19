import produce from "immer";
import keywords from "./keywords";
import { Language, TokenMatrix } from './tokenize';

export interface Game {
  code: string;
  language: Language;
  gameFinished: boolean;
  lastTyped: number;
  currentLine: number;
  currentToken: number;
  currentCharacter: number;
  tokens: TokenMatrix;
}

export const init: Game = {
  code: "",
  language: "RUBY",
  tokens: [],
  gameFinished: false,
  lastTyped: NaN,
  currentLine: 0,
  currentToken: 0,
  currentCharacter: 0,
};

export type Action = {
  type: "INITIALIZE_GAME";
  payload: { code: string; language: Language };
};

export let reduce = (prev: Game, action: Action): Game => {
  switch (action.type) {
    case "INITIALIZE_GAME": {
      return produce(prev, (draft) => {
        draft.code = action.payload.code;
        draft.language = action.payload.language;
      });
    }
  }
};

if (process.env.NODE_ENV === "development") {
  const baseReduce = reduce;
  let oldPrev: Game | null = null;
  let oldAction: Action | null = null;
  const loggingReduce = (prev: Game, action: Action): Game => {
    let collapsedStyles = "color: black;";
    if (prev === oldPrev && oldAction === action) {
      collapsedStyles = "color: gray";
    }
    oldPrev = prev;
    oldAction = action;
    console.groupCollapsed(`%c${action.type}`, collapsedStyles);
    console.log("%cPREVIOUS: ", "color: blue; font-weight: bold;", prev);
    console.log("%cACTION: ", "color: purple; font-weight: bold;", action);
    const next = baseReduce(prev, action);
    console.log("%cNEXT: ", "color: green; font-weight: bold", next);
    console.groupEnd();
    return next;
  };
  reduce = loggingReduce;
}
