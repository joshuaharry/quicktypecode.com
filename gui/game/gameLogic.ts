import produce from "immer";
import { tokenize, TokenMatrix } from "./tokenize";
import { Language } from "./supportedLanguages";

const codeString = `def hello
  puts "Hello, world!"
end`;

export interface FetchedGame {
  id: number;
  code: string;
  language: Language;
}

export interface Game {
  id: number;
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
  loadingNewGame: boolean;
  loadedGameError: string;
}

export const init: Game = {
  id: 1,
  code: codeString,
  language: "RUBY",
  tokens: tokenize(codeString, "RUBY"),
  gameFinished: false,
  lastTyped: NaN,
  startedTyping: NaN,
  currentLine: 0,
  currentToken: 0,
  currentCharacter: 0,
  cursorIsLit: true,
  loadingNewGame: false,
  loadedGameError: "",
};

export type Action =
  | { type: "FETCHING_NEW_GAME" }
  | { type: "BLINK_REQUEST"; payload: number }
  | { type: "USER_TYPED"; payload: { character: string; time: number } }
  | { type: "INITIALIZE_NEW_GAME"; payload: FetchedGame };

export const scoreGame = (game: Game): number => {
  let numTokens = 0;
  for (const line of game.tokens) {
    for (let i = 0; i < line.length; ++i) {
      const token = line[i];
      if (i === 0 && token.text.includes(" ")) {
        continue;
      }
      numTokens += 1;
    }
  }
  const timeElapsed = game.lastTyped - game.startedTyping;
  return (numTokens / timeElapsed) * 60_000;
};

export const isInProgress = (game: Game): boolean =>
  !(game.gameFinished || Number.isNaN(game.startedTyping));

export let reduce = (prev: Game, action: Action): Game => {
  switch (action.type) {
    case "INITIALIZE_NEW_GAME": {
      return produce(prev, (draft) => {
        draft.id = action.payload.id;
        draft.language = action.payload.language;
        draft.code = action.payload.code;
	draft.tokens = tokenize(action.payload.code, action.payload.language);
        draft.loadingNewGame = false;
      });
    }
    case "FETCHING_NEW_GAME": {
      return produce(prev, (draft) => {
        draft.loadingNewGame = true;
      });
    }
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
        if (draft.gameFinished || draft.loadingNewGame) return;
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
