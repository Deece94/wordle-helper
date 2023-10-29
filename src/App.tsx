import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import dictionary from './dictionary';
import './App.css';

function App() {
  const [knownLetters, setKnownLetters] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [shownGuesses, setShownGuesses] = useState<number>(5);

  const updateKnown = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const newKnownLetters = [...knownLetters];
    let value = input.value;
    const pos = Number(input.dataset.pos);

    if (value.length > 1) {
      value = value.slice(0, 1);
      input.value = value;
    }

    newKnownLetters[pos] = value.toLowerCase();
    setKnownLetters(newKnownLetters);

    // Send cursor to next input
    if (pos < 4 && value.length === 1) {
      const nextPos = pos + 1;
      const nextInput = document.querySelector(
        `input[data-pos='${nextPos}']`
      ) as HTMLInputElement;
      nextInput.select();
    }
  };

  const updateGuessedLetters = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target as HTMLTextAreaElement;
    const newGuessedLetters = input.value.toLowerCase().split('');
    setGuessedLetters(newGuessedLetters);
  };

  const updateIncorrectLetters = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target as HTMLTextAreaElement;
    const newIncorrectLetters = input.value.toLowerCase().split('');
    setIncorrectLetters(newIncorrectLetters);
  };

  useEffect(() => {
    const newGuesses: string[] = [];

    const shuffledDictionary: string[] = sortArray(dictionary);

    shuffledDictionary.every((guessWord) => {
      const lowerCaseWord = guessWord.toLowerCase();

      // Check known letters are in the correct spot in the word
      for (let i = 0; i < 5; i++) {
        if (
          lowerCaseWord.charAt(i) !== knownLetters[i] &&
          knownLetters[i] !== ''
        ) {
          return true; // Continue
        }
      }

      // Check all semi correct letters are in the word
      let containsGuessedLetters = true;
      guessedLetters.every((letter) => {
        if (!lowerCaseWord.includes(letter)) {
          containsGuessedLetters = false;
          return false; // Break
        }
        return true; // Continue
      });
      if (!containsGuessedLetters) {
        return true; // Continue
      }

      // Check all incorrect letters are in the word
      let containsIncorrectLetters = false;
      incorrectLetters.every((letter) => {
        if (lowerCaseWord.includes(letter)) {
          containsIncorrectLetters = true;
          return false; // Break
        }
        return true; // Continue
      });
      if (containsIncorrectLetters) {
        return true; // Continue
      }

      newGuesses.push(lowerCaseWord);
      return true; // Continue
    });

    setGuesses(newGuesses);
    setShownGuesses(5);
  }, [knownLetters, guessedLetters, incorrectLetters]);

  const sortArray = (array: string[]) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const nf = new Intl.NumberFormat();

  return (
    <>
      <h1 className="headerTitle">Wordle Helper</h1>
      <div className="container">
        <div className="knownLetters">
          <input className="letter" data-pos={0} onChange={updateKnown} />
          <input className="letter" data-pos={1} onChange={updateKnown} />
          <input className="letter" data-pos={2} onChange={updateKnown} />
          <input className="letter" data-pos={3} onChange={updateKnown} />
          <input className="letter" data-pos={4} onChange={updateKnown} />
        </div>

        <div className="guessesSection">
          <h2 className="title">Semi correct Letters</h2>
          <textarea
            className="guesses"
            onChange={updateGuessedLetters}
          ></textarea>
        </div>

        <div className="guessesSection">
          <h2 className="title">Incorrect Letters</h2>
          <textarea
            className="guesses"
            onChange={updateIncorrectLetters}
          ></textarea>
        </div>

        <div className="suggestionsSection">
          <h2 className="title">Suggestions</h2>
          <ul className="guessList">
            {guesses.slice(0, shownGuesses).map((guess, index) => {
              return (
                <li className="listItem" key={index}>
                  {guess}
                </li>
              );
            })}
            {guesses.length > shownGuesses && (
              <>
                <li className="listItem">
                  + {nf.format(guesses.length - shownGuesses)} more
                </li>
                <li className="listItem">
                  <button
                    onClick={() => {
                      setShownGuesses(shownGuesses + 5);
                    }}
                  >
                    Show more
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
