import React from "react";
import type { NextPage } from "next";
import Game from '../components/Game';

const Home: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-center p-8">
      <h1 className="text-3xl font-extrabold mb-8">Quick, Type Code!</h1>
      <Game />
    </div>
  );
};

export default Home;
