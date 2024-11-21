import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const paragraph = `It was a typical Tuesday morning when Bob, a self-proclaimed professional napper, discovered a life-changing truth: socks do, in fact, vanish in the dryer not because of "laundry gremlins," but because they're socks. "It's time to go rogue." Little did he know, the sock world was a web of secrets, espionage, and lint-covered spies.`;

const TypingTest = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const charRefs = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);

  // Automatically focus on the input field when the component is rendered
  useEffect(() => {
    inputRef.current.focus();
    setCorrectWrong(Array(charRefs.current.length).fill(" "));
  }, []);

  useEffect(() => {
    let interval;
    if (typing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTypedChars = charIndex;
        let accuracy =
          totalTypedChars === 0 ? 0 : (correctChars / totalTypedChars) * 100;
        accuracy =
          accuracy < 0 || !accuracy || accuracy === Infinity
            ? 0
            : accuracy.toFixed(2);

        let wpm = Math.round((correctChars / 5 / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWpm(wpm);

        setAccuracy(accuracy); // Update the accuracy state
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setTyping(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [typing, timeLeft]);

  const handleChange = (e) => {
    const characters = charRefs.current;
    let currentChar = characters[charIndex];
    let typedChar = e.target.value.slice(-1);

    if (charIndex < characters.length && timeLeft > 0) {
      if (!typing) {
        setTyping(true);
      }
      if (typedChar === currentChar.textContent) {
        setCharIndex((prev) => prev + 1);
        correctWrong[charIndex] = "correct";
      } else {
        setCharIndex((prev) => prev + 1);
        setMistakes((prev) => prev + 1);
        correctWrong[charIndex] = "wrong";
      }
      if (charIndex >= characters.length - 1) {
        setTyping(false);
      }
    } else {
      setTyping(false);
    }
  };

  const resetGame = () => {
    setTimeLeft(maxTime); // Reset timer
    setMistakes(0); // Reset mistakes
    setWpm(0); // Reset WPM
    setAccuracy(100); // Reset Accuracy
    setCharIndex(0); // Reset character index
    setCorrectWrong(Array(paragraph.length).fill(" ")); // Reset feedback array
    setTyping(false); // Stop typing
    inputRef.current.value = ""; // Clear the input field
    inputRef.current.focus(); // Refocus input field
  };

  return (
    <div className="container">
      <div className="test">
        <input
          type="text"
          className="input-field"
          ref={inputRef}
          onChange={handleChange}
        />
        {paragraph.split("").map((word, index) => (
          <span
            key={index}
            className={`char ${index === charIndex ? "active" : ""} ${
              correctWrong[index]
            }`}
            ref={(e) => (charRefs.current[index] = e)}
          >
            {word}
          </span>
        ))}
      </div>
      <div className="result">
        <p>
          Time Left: <strong>{timeLeft}</strong>
        </p>
        <p>
          Mistakes: <strong>{mistakes}</strong>
        </p>
        <p>
          WPM: <strong>{wpm}</strong>
        </p>
        <p>
          Accuracy: <strong>{accuracy}%</strong>
        </p>
        <button className="btn" onClick={resetGame}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
