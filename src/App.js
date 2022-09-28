import { useEffect, useState } from 'react';
import dictionary from './dictionary';
import './App.css';

function App() {
  const [knownLetters, setKnownLetters] = useState(['', '', '', '', '']);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [guesses, setGuesses] = useState([]);

  const updateKnown = (e) => {
    const input = e.target;
    const newKnownLetters = [...knownLetters];
    let value = input.value;
    const pos = input.dataset.pos;

    if (value.length > 1) {
      value = value.slice(0, 1);
      input.value = value;
    }

    newKnownLetters[pos] = value;
    setKnownLetters(newKnownLetters);

    // Send cursor to next input
    if (pos < 4 && value.length === 1) {
      const nextPos = parseInt(pos) + 1;
      const nextInput = document.querySelector(`input[data-pos='${nextPos}']`);
      nextInput.select();
    }
  };

  const updateGuessedLetters = (e) => {
    const input = e.target;
    const newGuessedLetters = input.value.split('');
    setGuessedLetters(newGuessedLetters);
  };

  const updateIncorrectLetters = (e) => {
    const input = e.target;
    const newIncorrectLetters = input.value.split('');
    setIncorrectLetters(newIncorrectLetters);
  };

  useEffect(() => {
    const newGuesses = [];

    const shuffledDictionary = sortArray(dictionary);

    shuffledDictionary.every((word) => {
      // Check known letters
      for (let i = 0; i < 5; i++) {
        if (word.charAt(i) !== knownLetters[i] && knownLetters[i] !== '') {
          return true; // Continue
        }
      }

      // Check all semi correct letters are in the word
      let containsGuessedLetters = true;
      guessedLetters.every((letter) => {
        if (!word.includes(letter)) {
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
        if (word.includes(letter)) {
          containsIncorrectLetters = true;
          return false; // Break
        }
        return true; // Continue
      });
      if (containsIncorrectLetters) {
        return true; // Continue
      }

      newGuesses.push(word);
      if (newGuesses.length > 4) {
        return false; // Break
      }
      return true; // Continue
    });

    setGuesses(newGuesses);
  }, [knownLetters, guessedLetters, incorrectLetters]);

  const sortArray = (array) => {
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

  return (
    <div className="flex align-center">
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

      <div class="suggestionsSection">
        <h2 className="title">Suggestions</h2>
        <ul id="guess-list">
          {guesses.map((guess, index) => {
            return <li key={index}>{guess}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
