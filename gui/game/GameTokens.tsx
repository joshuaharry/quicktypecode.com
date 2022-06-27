import React from "react";
import { useGame, useDispatch } from "./GameContext";
import { Token } from "./tokenize";

interface LineOfCodeProps {
  lineNumber: number;
  row: Array<Token>;
}

interface TokenProps {
  lineNumber: number;
  tokenNumber: number;
  token: Token;
}

export const splitAtNum = (str: string, num: number) => {
  return [str.substring(0, num), str[num], str.substring(num + 1, str.length)];
};

const useBlinking = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "BLINK_REQUEST", payload: Date.now() });
    }, 500);
    return () => clearInterval(interval);
  }, [dispatch]);
};

const NewlineToken = () => {
  const { cursorIsLit } = useGame();
  return (
    <>
      <span className={`code ${cursorIsLit ? "lit" : ""}`}>↩︎</span>
      <style jsx>
        {`
          .code {
            font-family: monospace;
            font-size: 16px;
            margin-left: 8px;
          }
          .lit {
            background-color: white;
            color: black;
          }
        `}
      </style>
    </>
  );
};

const WhitespaceToken: React.FC<TokenProps> = (props) => {
  const { token } = props;
  const { cursorIsLit } = useGame();
  return (
    <>
      <span className={`code WHITESPACE ${cursorIsLit ? "lit" : ""}`}>
        {token.text}
      </span>
      <style jsx>
        {`
          .code {
            font-family: monospace;
            font-size: 16px;
          }
          .lit {
            background-color: white;
            color: black;
          }
          .WHITESPACE {
            padding-right: ${token.text.length * 8.5}px;
          }
        `}
      </style>
    </>
  );
};

const SPACE_REGEX = / /g;
const WHITESPACE = "\u00a0";

const TokenInProgress: React.FC<TokenProps> = (props) => {
  const { token } = props;
  const { currentCharacter, cursorIsLit } = useGame();
  useBlinking();
  if (token.text === "\n") {
    return <NewlineToken />;
  }
  if (token.syntax === "WHITESPACE") {
    return <WhitespaceToken {...props} />;
  }
  const [before, current, after] = splitAtNum(
    token.text.replace(SPACE_REGEX, WHITESPACE),
    currentCharacter
  );
  return (
    <>
      <span className="code">{before}</span>
      <span className={`code ${cursorIsLit ? "lit" : ""}`}>{current}</span>
      <span className="code">{after}</span>
      <style jsx>
        {`
          .code {
            font-family: monospace;
            font-size: 16px;
          }
          .lit {
            background-color: white;
            color: black;
          }
        `}
      </style>
    </>
  );
};

const TokenUntouched: React.FC<TokenProps> = (props) => {
  const { currentLine, currentToken, tokens } = useGame();
  const { lineNumber, token, tokenNumber } = props;
  const classNames = ["code"];

  const shouldUseSyntaxClassname =
    token.syntax === "WHITESPACE" ||
    currentLine > lineNumber ||
    (currentLine === lineNumber && currentToken > tokenNumber);

  classNames.push(shouldUseSyntaxClassname ? token.syntax : "UNTYPED");

  const atAnEmptyNewline =
    tokens[lineNumber].length === 1 &&
    tokens[lineNumber][tokenNumber].text === "\n";

  const text = atAnEmptyNewline ? "\u00a0" : token.text;

  return (
    <>
      <span className={classNames.join(" ")}>{text}</span>
      <style jsx>{`
        .code {
          font-family: monospace;
          font-size: 16px;
        }
        .UNTYPED {
          color: #bbbbbb;
        }
        .WHITESPACE {
          margin-right: ${token.text.length * 8.5}px;
        }
        .IDENTIFIER {
          color: white;
        }
        .KEYWORD {
          color: #f7bde4;
        }
        .STRING {
          color: #aef359;
        }
      `}</style>
    </>
  );
};

const Token: React.FC<TokenProps> = (props) => {
  const { currentLine, currentToken } = useGame();
  const { lineNumber, tokenNumber } = props;
  if (currentLine !== lineNumber || currentToken !== tokenNumber) {
    return <TokenUntouched {...props} />;
  }
  return <TokenInProgress {...props} />;
};

const LineOfCode: React.FC<LineOfCodeProps> = (props) => {
  const { lineNumber, row } = props;
  return (
    <div className="flex">
      {row.map((token, idx) => {
        return (
          <Token
            key={`token-${idx + 1}`}
            lineNumber={lineNumber}
            tokenNumber={idx}
            token={token}
          />
        );
      })}
    </div>
  );
};

const GameTokens = () => {
  const { tokens } = useGame();
  return (
    <div className="flex flex-col">
      {tokens.map((row, idx) => {
        return (
          <LineOfCode key={`line-${idx + 1}`} lineNumber={idx} row={row} />
        );
      })}
    </div>
  );
};

export default GameTokens;
