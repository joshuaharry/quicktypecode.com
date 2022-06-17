// Framework specific boilerplate; unless you're trying to change how parts
// of the app are wired together, you probably won't need to change anything
// in this file.
import React from "react";
import { init, reduce, Game } from "./gameLogic";

const GameStateContext = React.createContext<Game | null>(null);

export const useGame = (): Game => {
  const ctx = React.useContext(GameStateContext);
  if (ctx === null) {
    throw new Error("Please use useGame inside of its provider.");
  }
  return ctx;
};

const GameDispatchContext = React.createContext<React.Dispatch<Action> | null>(
  null
);

export const useDispatch = (): React.Dispatch<Action> => {
  const ctx = React.useContext(GameDispatchContext);
  if (ctx === null) {
    throw new Error("Please use useGame inside of its provider.");
  }
  return ctx;
};

interface GameProviderProps {
  children: React.ReactNode;
  language: string;
  code: string;
}

const GameProvider: React.FC<GameProviderProps> = (props) => {
  const { children, language, code } = props;
  const [game, dispatch] = React.useReducer(reduce, {
    ...init,
    language,
    code,
  });
  return (
    <GameStateContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export default GameProvider;
