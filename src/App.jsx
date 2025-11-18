import { useState } from "react";
import { Header } from "./components/Header";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText, getWord } from "./utils";
import Confetti from "react-confetti";

function App() {
  //state vals
  const [currentWord, setCurrentWord] = useState(() => getWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  //static vals
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  //derived vals
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const isLastGuessWrong =
    wrongGuessCount > 0 && !currentWord.includes(guessedLetters.at(-1));

  function guessLetter(char) {
    setGuessedLetters((prevGuessed) =>
      prevGuessed.includes(char) ? prevGuessed : [...prevGuessed, char]
    );
  }

  function resetGame() {
    setGuessedLetters([]);
    setCurrentWord(getWord());
  }

  const keyboard = Array.from(alphabet).map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    return (
      <button
        disabled={isGameOver}
        onClick={() => guessLetter(letter)}
        key={letter}
        className={clsx({
          "guess-right": isCorrect,
          "guess-wrong": isWrong,
        })}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const languageItems = languages.map((lang, index) => (
    <span
      className={`language ${index < wrongGuessCount ? "lost" : null}`}
      style={{
        backgroundColor: lang.backgroundColor,
        color: lang.color,
      }}
      key={lang.name}
    >
      {lang.name}
    </span>
  ));

  const wordItems = Array.from(currentWord).map((char, index) => {
    const isGuessedCorrect = guessedLetters.includes(char);
    return (
      <span
        key={index}
        className={clsx("word-letter", {
          "guess-wrong": isGameLost && !isGuessedCorrect,
        })}
      >
        {isGuessedCorrect || isGameLost ? char : ""}
      </span>
    );
  });

  function renderGameStatus() {
    if (!isGameOver) {
      if (isLastGuessWrong) {
        return <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>;
      } else {
        return null;
      }
    }

    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    } else {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
  }

  return (
    <main>
      <Header />
      <section
        className={clsx(
          "status-bar",
          !isGameOver && isLastGuessWrong && "wrong-guess",
          isGameWon && "game-won",
          isGameLost && "game-lost"
        )}
        aria-live="polite"
        role="status"
      >
        {renderGameStatus()}
      </section>
      <div className="languages-container">{languageItems}</div>
      <div className="word-container">{wordItems}</div>
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard-container">{keyboard}</section>
      {isGameOver && (
        <button className="new-game" onClick={resetGame}>
          New Game
        </button>
      )}
      {isGameWon && <Confetti />}
    </main>
  );
}

export default App;
