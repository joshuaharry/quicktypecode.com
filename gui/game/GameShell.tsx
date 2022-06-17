import React from "react";
import GameTokens from './GameTokens';

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
        <GameTokens />
      </div>
    </div>
  );
};

export default GameShell;
