import { ChangeEvent, useMemo, useState } from 'react';
import dictionary from './dictionary';
import './App.css';

function App() {
  const [correctLetters, setCorrectLetters] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const initialArray: string[][] = Array(5)
    .fill([])
    .map(() => []);
  const [semiCorrectLetters, setSemiCorrectLetters] =
    useState<string[][]>(initialArray); // a 2d array of guessed letters
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  const [shownGuesses, setShownGuesses] = useState<number>(5);

  const updateCorrect = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const newCorrectLetters = [...correctLetters];
    let value = input.value;
    const pos = Number(input.dataset.pos);

    if (value.length > 1) {
      value = value.slice(0, 1);
      input.value = value;
    }

    newCorrectLetters[pos] = value.toLowerCase();
    setCorrectLetters(newCorrectLetters);

    // Send cursor to next input
    if (pos < 4 && value.length === 1) {
      const nextPos = pos + 1;
      const nextInput = document.querySelector(
        `input[data-pos='${nextPos}']`
      ) as HTMLInputElement;
      nextInput.select();
    }
  };

  // Updates the guessed letters array for a specific letter position
  const updateSemiCorrect = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target as HTMLTextAreaElement;
    const newSemiCorrectLetters = input.value.toLowerCase().split('');
    const newSemiCorrectLettersArray = [...semiCorrectLetters];
    const pos = Number(input.dataset.pos);

    newSemiCorrectLettersArray[pos] = newSemiCorrectLetters;
    setSemiCorrectLetters(newSemiCorrectLettersArray);
  };

  // Updates the incorrect letters array
  const updateIncorrectLetters = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target as HTMLTextAreaElement;
    const newIncorrectLetters = input.value.toLowerCase().split('');
    setIncorrectLetters(newIncorrectLetters);
  };

  // Shuffles array in place
  const shuffleArray = (array: string[]) => {
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

  const guesses = useMemo(() => {
    const newGuesses: string[] = [];

    const shuffledDictionary: string[] = shuffleArray(dictionary);

    shuffledDictionary.forEach((guessWord) => {
      const lowerCaseWord = guessWord.toLowerCase();

      // Check known letters are in the correct spot in the word
      for (let i = 0; i < 5; i++) {
        if (
          lowerCaseWord.charAt(i) !== correctLetters[i] &&
          correctLetters[i] !== ''
        ) {
          return; // Continue to next word
        }
      }

      // Check semi correct letters array to see if they are in the word but not at this position
      const fulfillsSemiCorrectLetters = semiCorrectLetters.every(
        (letters, index) => {
          // If no letters have been guessed for this position, continue
          if (letters.length === 0) {
            return true;
          }

          // Check each semi correct letter to see if it is in the word in another position but not this one
          const fulfillsSemiCorrectLetter = letters.every((letter) => {
            if (
              lowerCaseWord.includes(letter) &&
              lowerCaseWord.charAt(index) !== letter
            ) {
              return true;
            }
            return false;
          });

          return fulfillsSemiCorrectLetter;
        }
      );
      if (!fulfillsSemiCorrectLetters) {
        return;
      }

      // Check all incorrect letters are in the word
      let containsIncorrectLetters = incorrectLetters.some((letter) => {
        if (lowerCaseWord.includes(letter)) {
          return true;
        }
        return false;
      });
      if (containsIncorrectLetters) {
        return;
      }

      newGuesses.push(lowerCaseWord);
    });

    setShownGuesses(5);

    return newGuesses;
  }, [correctLetters, semiCorrectLetters, incorrectLetters]);

  const nf = new Intl.NumberFormat();

  return (
    <>
      <h1 className="header-title">Wordle Helper</h1>
      <div className="container">
        <div className="known-section">
          <input className="letter" data-pos={0} onChange={updateCorrect} />
          <input className="letter" data-pos={1} onChange={updateCorrect} />
          <input className="letter" data-pos={2} onChange={updateCorrect} />
          <input className="letter" data-pos={3} onChange={updateCorrect} />
          <input className="letter" data-pos={4} onChange={updateCorrect} />
        </div>

        <h2 className="title">Semi correct Letters</h2>
        <div className="guesses-section">
          <textarea
            className="guessed-letter"
            onChange={updateSemiCorrect}
            data-pos={0}
          ></textarea>
          <textarea
            className="guessed-letter"
            onChange={updateSemiCorrect}
            data-pos={1}
          ></textarea>
          <textarea
            className="guessed-letter"
            onChange={updateSemiCorrect}
            data-pos={2}
          ></textarea>
          <textarea
            className="guessed-letter"
            onChange={updateSemiCorrect}
            data-pos={3}
          ></textarea>
          <textarea
            className="guessed-letter"
            onChange={updateSemiCorrect}
            data-pos={4}
          ></textarea>
        </div>

        <h2 className="title">Incorrect Letters</h2>
        <div className="incorrect-section">
          <textarea
            className="guesses"
            onChange={updateIncorrectLetters}
          ></textarea>
        </div>

        <h2 className="title">Suggestions</h2>
        <div className="suggestions-section">
          <ul className="guess-list">
            {guesses.slice(0, shownGuesses).map((guess, index) => {
              return (
                <li className="guess-list-item" key={index}>
                  {guess}
                </li>
              );
            })}
            {guesses.length > shownGuesses && (
              <>
                <li className="guess-list-item">
                  + {nf.format(guesses.length - shownGuesses)} more
                </li>
                <li className="guess-list-item">
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
