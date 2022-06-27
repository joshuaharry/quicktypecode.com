import React from "react";
import { useRouter } from "next/router";
import { useGame, useDispatch } from "./GameContext";
import { LANGUAGES, Language } from "./supportedLanguages";
import { isInProgress, FetchedGame } from "./gameLogic";
import Spinner from "../components/Spinner";

export type ChallengeFetcher = (config: {
  oldLanguage: string;
  newLanguage: string;
  except: number;
}) => Promise<void>;

const readParamsFromUrl = (): { language: string; id: number } | null => {
  if (typeof window === undefined) return null;
  const search = window.location.search;
  const queryParams: Record<string, string> = {};
  for (const el of search.substring(1, search.length).split("&")) {
    const [key, value] = el.split("=");
    queryParams[key] = value;
  }
  const language: string = queryParams["language"] || "RUBY";
  const id: number = Number.parseInt(queryParams["id"], 10) || 1;
  return { language, id };
};

const useFetchNewChallenge = (): ChallengeFetcher => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id, language } = useGame();

  const fetcher: ChallengeFetcher = React.useCallback(
    async (config) => {
      const { newLanguage, oldLanguage, except } = config;
      dispatch({ type: "FETCHING_NEW_GAME" });
      try {
        const res = await window.fetch(
          `${
            process.env.NEXT_PUBLIC_API_PATH
          }/challenges/random?language=${newLanguage}${
            newLanguage === oldLanguage ? `&except=${except}` : ""
          }`
        );
        if (!res.ok) {
          throw new Error("FAILED TO FETCH GAME");
        }
        const newGame = (await res.json()) as FetchedGame;

        dispatch({ type: "INITIALIZE_NEW_GAME", payload: newGame });
        router.push(`/?language=${newGame.language}&id=${newGame.id}`);
      } catch (err) {
        dispatch({ type: "CANCEL_FETCH" });
      }
    },
    [dispatch, router]
  );

  React.useEffect(() => {
    async function fetchNewGameWhenNecessary() {
      const urlParams = readParamsFromUrl();
      if (urlParams === null) return;
      const { language: urlLanguage, id: urlId } = urlParams;
      if (urlLanguage === language && id === urlId) return;
      dispatch({ type: "FETCHING_NEW_GAME" });
      try {
        const res = await window.fetch(
          `${process.env.NEXT_PUBLIC_API_PATH}/challenges/by-id?language=${urlLanguage}&id=${urlId}`
        );
        if (!res.ok) {
          throw new Error("FAILED TO FETCH NEW GAME");
        }
        const newGame = (await res.json()) as FetchedGame;
        dispatch({ type: "INITIALIZE_NEW_GAME", payload: newGame });
      } catch (err) {
        dispatch({ type: "CANCEL_FETCH" });
      }
    }
    fetchNewGameWhenNecessary();
  }, [id, language, dispatch]);

  return fetcher;
};

const GameControls: React.FC = () => {
  const game = useGame();
  const currentlyPlaying = isInProgress(game);
  const { loadingNewGame } = game;
  const inProgress = currentlyPlaying || loadingNewGame;
  const fetcher = useFetchNewChallenge();
  return (
    <div className="flex items-center w-96 justify-between mb-4">
      <select
        value={game.language}
        disabled={inProgress}
        onChange={(e) =>
          fetcher({
            except: game.id,
            newLanguage: e.target.value as Language,
            oldLanguage: game.language,
          })
        }
      >
        {LANGUAGES.map((language) => {
          return (
            <option value={language} key={language}>
              {language[0] + language.slice(1).toLowerCase()}
            </option>
          );
        })}
      </select>
      {loadingNewGame ? <Spinner /> : null}
      <button
        onClick={() => {
          fetcher({
            except: game.id,
            newLanguage: game.language,
            oldLanguage: game.language,
          });
        }}
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
