import { useEffect, useState } from 'react';
import Timer from './components/Timer';
import WordsDisplay from './components/WordsDisplay';
import WordsInput from './components/WordsInput';
import './styles.css';
import axios from 'axios';
import useCountdownTimer from './hooks/useCountdownTimer';
import Scoreboard from './components/Scoreboard';
import SelectMenu from './components/SelectMenu';
import Toggle from './components/Toggle';
import useDarkMode from './hooks/useDarkMode';

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

function range(start = 0, end) {
  return [...Array(end + 1 - start).keys()].map((x) => x + start);
}

function formatMinute(x) {
  return `${x} minute${x > 1 ? 's' : ''}`;
}

const TIMEOUT_SELECTIONS = range(1, 5).map((x) => {
  return {
    value: x,
    display: formatMinute(x),
  };
});

function App() {
  const [initialCountdown, setInitialCountdown] = useState({
    minutes: 1,
  });
  const [displayTokens, setDisplayTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const isNewGame = !inputDisabled;
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const {
    timerStarted,
    startTimer,
    stopTimer,
    restoreDefaultTime,
    minutes,
    seconds,
  } = useCountdownTimer(initialCountdown);
  const gameEnd =
    (!loading && !timerStarted && inputDisabled) ||
    (minutes <= 0 && seconds <= 0);

  useEffect(() => {
    let timeout;
    if (!gameEnd) {
      setShowScoreBoard(gameEnd);
    } else {
      timeout = setTimeout(() => {
        setShowScoreBoard(gameEnd);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [gameEnd]);

  useEffect(() => {
    const disableInput = !timerStarted;
    setInputDisabled(disableInput);
  }, [timerStarted]);

  const gameInProgress = timerStarted && !inputDisabled;

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
          setLoading(false);
          setDisplayTokens(tokens);
          setInputDisabled(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (loading) {
      fetchRandomQuotes();
    }
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, [loading]);

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
      if (previousInput !== previousWord) {
        newTokens[previousIndex].state = 'incorrect';
      } else if (previousInput !== ' ') {
        newTokens[previousIndex].state = 'correct';
      }
    }
    setDisplayTokens(newTokens);
    // game over
    if (currentIndex === displayTokens.length) {
      setInputDisabled(true);
      stopTimer();
    }
  }

  const getCorrectWords = () =>
    displayTokens.filter((token) => token.state === 'correct').length;
  const getTotalWords = () =>
    displayTokens.filter(
      (token) =>
        token.word !== ' ' &&
        (token.state === 'correct' || token.state === 'incorrect')
    ).length;
  const getElapsedSeconds = () =>
    initialCountdown.minutes * 60 - (minutes * 60 + seconds);

  const handleRestartGame = () => {
    setLoading(true);
    restoreDefaultTime();
  };

  const handleSelectedTimeoutChange = (val) => {
    setInitialCountdown({
      minutes: val,
    });
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''} `}>
      {showScoreBoard && (
        <Scoreboard
          onRestartGame={handleRestartGame}
          totalWords={getTotalWords()}
          correctWords={getCorrectWords()}
          elapsedSeconds={getElapsedSeconds()}
        />
      )}
      <div className='typing-container'>
        <div className='typing-header'>
          <SelectMenu
            disabled={gameInProgress}
            items={TIMEOUT_SELECTIONS}
            onChange={handleSelectedTimeoutChange}
          />
          <Toggle checked={darkMode} onToggle={toggleDarkMode} />
        </div>
        <Timer minutes={minutes} seconds={seconds} />
        <WordsDisplay refresh={isNewGame} tokens={displayTokens} />
        <WordsInput
          onTextChanged={handleTextChanged}
          disabled={inputDisabled}
          clearText={!loading}
        />
      </div>
    </div>
  );
}

export default App;
