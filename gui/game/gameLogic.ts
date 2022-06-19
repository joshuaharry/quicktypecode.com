import produce from "immer";
import keywords from "./keywords";
import { TokenMatrix } from "./tokenize";
import { Language } from "./supportedLanguages";

export interface Game {
  code: string;
  language: Language;
  gameFinished: boolean;
  lastTyped: number;
  startedTyping: number;
  cursorIsLit: boolean;
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
  startedTyping: NaN,
  currentLine: 0,
  currentToken: 0,
  currentCharacter: 0,
  cursorIsLit: true,
};

export type Action =
  | { type: "BLINK_REQUEST"; payload: number }
  | { type: "USER_TYPED"; payload: { character: string; time: number } };

export let reduce = (prev: Game, action: Action): Game => {
  switch (action.type) {
    case "BLINK_REQUEST": {
      return produce(prev, (draft) => {
        const neverTyped = Number.isNaN(draft.startedTyping);
	if (neverTyped) return;
        const havePausedTyping =
          Math.abs(action.payload - draft.lastTyped) > 600;
        if (neverTyped || havePausedTyping) {
          draft.cursorIsLit = !draft.cursorIsLit;
        }
      });
    }
    case "USER_TYPED": {
      return produce(prev, (draft) => {
        draft.lastTyped = action.payload.time;
        if (draft.gameFinished) return;
        const haveNotTyped = Number.isNaN(draft.startedTyping);
        if (haveNotTyped) {
          draft.startedTyping = action.payload.time;
        }
        draft.cursorIsLit = true;
        const currentLine = draft.tokens[draft.currentLine];
        const currentToken = currentLine[draft.currentToken];
        const currentCharacter = currentToken.text[draft.currentCharacter];
        if (currentCharacter !== action.payload.character) return;
        if (draft.currentCharacter + 1 < currentToken.text.length) {
          draft.currentCharacter += 1;
          return;
        }
        draft.currentCharacter = 0;
        if (draft.currentToken + 1 < currentLine.length) {
          draft.currentToken += 1;
          return;
        }
        if (draft.currentLine + 1 < draft.tokens.length) {
          draft.currentLine += 1;
          draft.currentToken = draft.tokens[draft.currentLine].findIndex(
            (x) => !x.text.includes(" ")
          );
	  return;
        }
	draft.currentLine += 1;
        draft.gameFinished = true;
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
