import React from "react";
import type { NextPage } from "next";
import Game from '../game';
import TitleBar from '../components/TitleBar';

const Home: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <TitleBar />
      <Game />
    </div>
  );
};

export default Home;
