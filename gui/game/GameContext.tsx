// Framework specific boilerplate; unless you're trying to change how parts
// of the app are wired together, you probably won't need to change anything
// in this file.
import React from "react";
import { init, reduce, Game, Action, Language, tokenize } from "./gameLogic";

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

export interface GameProps {
  language: Language;
  code: string;
}

const GameProvider: React.FC<
  GameProps & { children: React.ReactNode }
> = (props) => {
  const { children, code, language } = props;
  const tokens = React.useMemo(() => {
    return tokenize(code, language);
  }, [language, code]);
  const [game, dispatch] = React.useReducer(reduce, {
    ...init,
    language,
    code,
    tokens,
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
