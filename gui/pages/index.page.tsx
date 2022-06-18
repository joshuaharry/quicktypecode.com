import React from "react";
import type { NextPage } from "next";
import Game from '../game';

const codeString = `def hello
  puts "Hello, world!"
end`

const Home: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-center p-8">
      <h1 className="text-3xl font-extrabold mb-8">Quick, Type Code!</h1>
      <Game language="RUBY" code={codeString} />
    </div>
  );
};

export default Home;
