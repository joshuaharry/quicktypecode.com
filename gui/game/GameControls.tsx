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

interface UrlConfig {
  language: string;
  except: string;
}

const asString = (arg: undefined | string | string[]): string | null => {
  return typeof arg !== "string" || arg === "" ? null : arg;
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
        const newGame = (await res.json()) as FetchedGame;
        dispatch({ type: "INITIALIZE_NEW_GAME", payload: newGame });
        router.push(`/?language=${newGame.language}&except=${newGame.id}`);
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch, router]
  );

  React.useEffect(
    function syncURLToGameStateOnMountEffect() {
      if (typeof window === undefined) return;
      const search = window.location.search;
      const queryParams: Record<string, string> = {};
      for (const el of search.substring(1, search.length).split("&")) {
        const [key, value] = el.split("=");
        queryParams[key] = value;
      }
      const urlLanguage: string = queryParams["language"] || "RUBY";
      const exceptNum: number = Number.parseInt(queryParams["except"], 10) || 1;
      if (urlLanguage !== language || exceptNum !== id) {
	console.log('Fetch the game!');
      }
    },
    [id, language]
  );

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
