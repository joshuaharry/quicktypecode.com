import React from "react";

const Game = () => {
  const ref = React.useRef<null | HTMLTextAreaElement>(null);
  return (
    <div className="w-96 h-96 relative">
      <textarea
        ref={ref}
        className="w-full h-full bg-black border-solid border-4 absolute"
        onChange={(e) => console.log(e)}
      />
      <div
        className="absolute text-white w-full h-full z-10 flex m-4"
        onClick={() => ref.current?.focus()}
      >
        <pre>
          <code>Code goes here...</code>
        </pre>
      </div>
    </div>
  );
};

export default Game;
