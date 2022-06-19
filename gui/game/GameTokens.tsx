import React from "react";
import { useGame } from "./GameContext";
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
  // FILL ME IN
};

const TokenInProgress: React.FC<TokenProps> = (props) => {
  const { token } = props;
  const { currentCharacter } = useGame();
  return (
    <>
      <span className="code">{token.text}</span>
      <style jsx>
        {`
          .code {
            font-family: monospace;
            font-size: 16px;
          }
        `}
      </style>
    </>
  );
};

const TokenUntouched: React.FC<TokenProps> = (props) => {
  const { currentLine, currentToken } = useGame();
  const { lineNumber, token, tokenNumber } = props;
  const classNames = ["code"];

  const shouldUseSyntaxClassname =
    token.syntax === "WHITESPACE" ||
    currentLine > lineNumber ||
    currentToken > tokenNumber;

  classNames.push(shouldUseSyntaxClassname ? token.syntax : "UNTYPED");

  return (
    <>
      <span className={classNames.join(" ")}>{token.text}</span>
      <style jsx>{`
        .code {
          font-family: monospace;
          font-size: 16px;
        }
        .UNTYPED {
          color: #bbbbbb;
        }
        .WHITESPACE {
          margin-right: ${token.text.length * 8}px;
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
