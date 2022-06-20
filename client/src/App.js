import { useEffect, useState } from 'react';
import Timer from './components/Timer';
import WordsDisplay from './components/WordsDisplay';
import WordsInput from './components/WordsInput';
import './styles.css';
import axios from 'axios';
import useCountdownTimer from './hooks/useCountdownTimer';

function getDisplayTokens(str) {
  return str.split(/(\s{1})/).map((word) => {
    return {
      state: '',
      word,
    };
  });
}

const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/quotes';

function randomBetween(start, end) {
  return Math.floor(start + Math.random() * (end + 1));
}

function App() {
  const [displayTokens, setDisplayTokens] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const isNewGame = !inputDisabled;
  const { timerStarted, startTimer, stopTimer, minutes, seconds } =
    useCountdownTimer({
      minutes: 1,
    });

  useEffect(() => {
    const disableInput = !timerStarted;
    setInputDisabled(disableInput);
  }, [timerStarted]);

  useEffect(() => {
    let source = axios.CancelToken.source();
    let unmounted = false;

    const fetchRandomQuotes = async () => {
      try {
        const res = await axios.get(RANDOM_QUOTE_API_URL, {
          params: { page: randomBetween(1, 94) },
          cancelToken: source.token,
        });
        const results = res.data.results;
        const quotes = results.map((quote) => quote.content).join(' ');
        if (!unmounted) {
          const tokens = getDisplayTokens(quotes);
          setDisplayTokens(tokens);
          setInputDisabled(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRandomQuotes();
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, []);

  function handleTextChanged(e) {
    if (!timerStarted) {
      startTimer();
    }
    const inputTokens = e.data.split(/(\s{1})/);

    if (inputTokens[inputTokens.length - 1] === '') {
      inputTokens.pop();
    }
    const currentIndex = inputTokens.length - 1;
    if (currentIndex > displayTokens.length) {
      // finish typing
      return;
    }
    const newTokens = Array.from(displayTokens);
    // current
    if (newTokens[currentIndex] !== undefined) {
      newTokens[currentIndex].state = 'current';
    }
    // next
    if (currentIndex < newTokens.length - 1) {
      newTokens[currentIndex + 1].state = '';
    }
    // previous
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0 && previousIndex < inputTokens.length) {
      const previousInput = inputTokens[previousIndex];
      const previousWord = newTokens[previousIndex].word;
      if (previousInput === previousWord) {
        newTokens[previousIndex].state = 'correct';
      } else {
        newTokens[previousIndex].state = 'incorrect';
      }
    }
    setDisplayTokens(newTokens);
    // game over
    if (currentIndex === displayTokens.length) {
      setInputDisabled(true);
      stopTimer();
    }
  }

  return (
    <div className='container'>
      <div className='typing-container'>
        <Timer minutes={minutes} seconds={seconds} />
        <WordsDisplay refresh={isNewGame} tokens={displayTokens} />
        <WordsInput
          onTextChanged={handleTextChanged}
          disabled={inputDisabled}
        />
      </div>
    </div>
  );
}

export default App;
