import React from "react";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import a11y from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark";

const codeString = `def hello
  "Hello, world!"
end
`;

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
        className="absolute text-white w-full h-full z-10 flex"
        onClick={() => ref.current?.focus()}
      >
        <ReactSyntaxHighlighter
          language="ruby"
          style={a11y}
          customStyle={{ width: "100%", height: "100%" }}
        >
          {codeString}
        </ReactSyntaxHighlighter>
      </div>
    </div>
  );
};

export default Game;
