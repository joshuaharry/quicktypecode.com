import React from "react";
import GameTokens from "./GameTokens";

const LineNumbers = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 15 }).map((_, i) => {
        return (
          <span
            className="font-mono pr-1 text-base text-amber-400"
            key={`line-${i + 1}`}
          >
            {(i + 1).toString()}
          </span>
        );
      })}
    </div>
  );
};

const GameShell = () => {
  const ref = React.useRef<null | HTMLTextAreaElement>(null);
  return (
    <div className="w-96 h-96 relative">
      <textarea
        value=""
        ref={ref}
        className="w-full h-full bg-black border-solid border-4 absolute"
        onChange={(e) => console.log(e)}
      />
      <div
        className="absolute text-white w-full h-full z-10 m-2 flex"
        onClick={() => ref.current?.focus()}
      >
        <LineNumbers />
        <GameTokens />
      </div>
    </div>
  );
};

export default GameShell;
