import produce from "immer";

const PATTERNS = {
  IDENTIFIER: /^[a-zA-Z_\*\?]*/g,
  WHITESPACE: /^\s*/g,
  NUMBER: /^\d*/g,
  // See https://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes
  STRING: /^"(?:[^"\\]|\\.)*"/g,
  // Some editors might get confused by the nested quotes, so we fix the
  // syntax highlighting with this comment: "
  NEWLINE: /^\n/g,
  LEFT_BRACKET: /^\{/g,
  RIGHT_BRACKET: /^\}/g,
  COMMA: /^,/g,
  COLON: /^:/g,
  SEMICOLON: /^;/g,
  LEFT_PAREN: /^\(/g,
  RIGHT_PAREN: /^\)/g,
};

type Syntax = keyof typeof PATTERNS;

const PATTERN_ENTRIES = Object.entries(PATTERNS) as Array<[Syntax, RegExp]>;

export type Language = "RUBY" | "PYTHON" | "C";

export interface Token {
  syntax: Syntax;
  text: string;
}

export type TokenMatrix = Array<Array<Token>>;

export const tokenize = (code: string, language: Language): TokenMatrix => {
  const out: TokenMatrix = [];
  const lines = code.split("\n");
  for (let line of lines) {
    const tokens: Array<Token> = [];
    while (line !== "") {
      let match: string | null = null;
      let pattern: [Syntax, RegExp] | null = null;
      for (const entry of PATTERN_ENTRIES) {
        const patternExp = entry[1];
        const res = patternExp.exec(line);
        if (res === null) {
          continue;
        }
        const candidateMatch = res[0];
        if (match === null || candidateMatch.length > match.length) {
          match = candidateMatch;
          pattern = entry;
        }
      }
      if (match === null || pattern === null) {
        throw new Error(`Lexing error on line: ${line}`);
      }
      tokens.push({ syntax: pattern[0], text: match });
      line = line.slice(pattern[1].lastIndex);
      pattern[1].lastIndex = 0;
    }
    tokens.push({ syntax: "NEWLINE", text: "\n" });
    out.push(tokens);
  }
  return out;
};

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
