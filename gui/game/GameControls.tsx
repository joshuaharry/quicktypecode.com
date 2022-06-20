import React from "react";
import { useGame } from "./GameContext";
import { LANGUAGES } from "./supportedLanguages";
import { isInProgress } from "./gameLogic";

const GameControls: React.FC = () => {
  const game = useGame();
  const inProgress = isInProgress(game);
  return (
    <div className="flex items-center w-96 justify-around mb-2">
      <select
        value={game.language}
        disabled={inProgress}
        onChange={(e) => console.log(e)}
      >
        {LANGUAGES.map((language) => {
          return (
            <option value={language} key={language}>
              {language[0] + language.slice(1).toLowerCase()}
            </option>
          );
        })}
      </select>
      <button
        disabled={inProgress}
        className={`btn btn-green ${inProgress ? "disabled" : ""}`}
      >
        New Challenge
      </button>
      <style jsx>{`
        .disabled {
          opacity: 60%;
          background-color: rgb(22 163 74);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default GameControls;
