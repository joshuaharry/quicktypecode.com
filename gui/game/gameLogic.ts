import produce from "immer";

// State
type Syntax = "STRING" | "IDENTIFIER";

export interface Token {
  syntax: Syntax;
  text: string;
}

export interface Game {
  code: string;
  language: string;
  gameFinished: boolean;
  lastTyped: number;
  currentLine: number;
  currentToken: number;
  currentCharacter: number;
  tokens: Array<Array<Token>>;
}

export const init: Game = {
  code: "",
  language: "",
  tokens: [],
  gameFinished: false,
  lastTyped: NaN,
  currentLine: 0,
  currentToken: 0,
  currentCharacter: 0,
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
