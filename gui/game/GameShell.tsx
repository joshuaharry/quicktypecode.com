import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ruby from "react-syntax-highlighter/dist/cjs/languages/hljs/ruby";
import a11y from "react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark";

SyntaxHighlighter.registerLanguage("ruby", ruby);

const codeString = `def hello
  puts "Hello, world!"
end`;

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
        className="absolute text-white w-full h-full z-10 flex"
        onClick={() => ref.current?.focus()}
      >
        <SyntaxHighlighter
          language="ruby"
          style={a11y}
          customStyle={{ width: "100%", height: "100%" }}
          showLineNumbers
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default GameShell;
