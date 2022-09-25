import { useState } from "react";
import dictionary from "./dictionary";

function App() {
  const [knownLetters, setKnownLetters] = useState(["", "", "", "", ""]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [guesses, setGuesses] = useState([]);

  const updateKnown = (e) => {
    const input = e.target;
    const newKnownLetters = knownLetters;
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

    updateGuesses();
  };

  const updateGuessedLetters = (e) => {
    const input = e.target;
    const newGuessedLetters = input.value.split("");
    console.log(newGuessedLetters);

    setGuessedLetters(newGuessedLetters);

    updateGuesses();
  };

  const updateIncorrectLetters = (e) => {
    const input = e.target;
    const newIncorrectLetters = input.value.split("");
    console.log(newIncorrectLetters);
    setIncorrectLetters(newIncorrectLetters);

    updateGuesses();
  };

  const updateGuesses = () => {
    const newGuesses = [];

    const shuffledDictionary = shuffle(dictionary);

    shuffledDictionary.every((word) => {
      // Check known letters
      for (let i = 0; i < 5; i++) {
        if (word.charAt(i) !== knownLetters[i] && knownLetters[i] !== "") {
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
  };

  const shuffle = (array) => {
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
      <div>
        <input className="border" data-pos={0} onChange={updateKnown} />
        <input className="border" data-pos={1} onChange={updateKnown} />
        <input className="border" data-pos={2} onChange={updateKnown} />
        <input className="border" data-pos={3} onChange={updateKnown} />
        <input className="border" data-pos={4} onChange={updateKnown} />
      </div>

      <label>Semi correct Letters</label>
      <textarea onChange={updateGuessedLetters}></textarea>

      <label>Incorrect Letters</label>
      <textarea onChange={updateIncorrectLetters}></textarea>

      <h2>Suggestions</h2>
      <ul id="guess-list">
        {guesses.map((guess, index) => {
          return <li key={index}>{guess}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
