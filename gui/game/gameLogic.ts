import produce from "immer";

// State
type Syntax =
  | "STRING"
  | "IDENTIFIER"
  | "WHITESPACE"
  | "NEWLINE"
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_BRACKET"
  | "RIGHT_BRACKET"
  | "COMMA"
  | "COLON"
  | "SEMICOLON";

export type Language = "RUBY" | "PYTHON" | "C";

export interface Token {
  syntax: Syntax;
  text: string;
}

export type TokenMatrix = Array<Array<Token>>;

type Lexer = (line: string) => Array<Token>;

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

const lexers: Record<Language, Lexer> = {
  RUBY() {
    return [];
  },
  C() {
    return [];
  },
  PYTHON() {
    return [];
  },
};

export const tokenize = (code: string, language: Language): TokenMatrix => {
  const out: TokenMatrix = [];
  const lines = code.split("\n");
  for (const line of lines) {
    out.push([]);
  }
  return out;
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
