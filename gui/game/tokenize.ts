import { Language } from "./supportedLanguages";
import keywords from "./keywords";

interface Execable {
  exec: (input: string) => [string, ...any];
  lastIndex: number;
}

const KEYWORD = {
  exec: () => null,
  lastIndex: 0,
};

const STRING = {
  exec(str: string): null | [string, ...any] {
    const delimiter: string = str[0];
    if (delimiter !== `'` && delimiter !== `"` && delimiter !== "`")
      return null;
    let i = 1;
    for (; i < str.length; ++i) {
      const check = str[i];
      if (check === "\\") {
        i += 1;
      } else if (check === delimiter) {
        break;
      }
    }
    if (i === str.length) {
      throw new Error(`LEXING ERROR: Unterminated string in ${str}`);
    }
    this.lastIndex = i + 1;
    return [str.substring(0, this.lastIndex)];
  },
  lastIndex: 0,
};

STRING.exec = STRING.exec.bind(STRING);

export const PATTERNS = {
  IDENTIFIER: /^[a-zA-Z_\*\?]+/g,
  WHITESPACE: /^\s+/g,
  NUMBER: /^\d+/g,
  NEWLINE: /^\n/g,
  LEFT_BRACKET: /^\{/g,
  RIGHT_BRACKET: /^\}/g,
  LEFT_SQUARE: /^\[/g,
  RIGHT_SQUARE: /^\]/g,
  LESS_THAN: /^\</g,
  GREATER_THAN: /^\>/g,
  POUND: /^#/g,
  COMMA: /^,/g,
  DOT: /^\./g,
  COLON: /^:/g,
  AT: /^@/g,
  LOGIC: /^[&|]/g,
  MATH: /^(=|-|\+|\%)/g,
  SEMICOLON: /^;/g,
  LEFT_PAREN: /^\(/g,
  RIGHT_PAREN: /^\)/g,
  STRING,
  KEYWORD,
} as const;

type Syntax = keyof typeof PATTERNS;

const PATTERN_ENTRIES = Object.entries(PATTERNS) as Array<[Syntax, Execable]>;

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
      let pattern: [Syntax, Execable] | null = null;
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
      const isKeyword =
        pattern[0] === "IDENTIFIER" && keywords[language].has(match);
      const syntax = isKeyword ? "KEYWORD" : pattern[0];
      tokens.push({ syntax, text: match });
      line = line.slice(pattern[1].lastIndex);
      pattern[1].lastIndex = 0;
    }
    tokens.push({
      syntax: "NEWLINE",
      text: "\n",
    });
    out.push(tokens);
  }
  return out;
};
