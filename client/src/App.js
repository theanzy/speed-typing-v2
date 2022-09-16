import { useCallback, useEffect, useState } from 'react';
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
import { getList, addToList, getValues } from './localData';
import calculateGameScore from './score';
import BarChart from './components/BarChart';
import Loader from './components/Loader';

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

const TIMEOUT_SELECTIONS = [
  {
    value: 10,
    display: '10 seconds',
  },
  {
    value: 30,
    display: '30 seconds',
  },
  {
    value: 60,
    display: '1 minute',
  },
  {
    value: 120,
    display: '2 minutes',
  },
  {
    value: 180,
    display: '3 minutes',
  },
];

function App() {
  const [initialCountdown, setInitialCountdown] = useState({
    seconds: 10,
  });
  const [score, setScore] = useState({});

  const [displayTokens, setDisplayTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(true);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const {
    timerStarted,
    startTimer,
    stopTimer,
    restoreDefaultTime,
    minutes: minutesLeft,
    seconds: secondsLeft,
  } = useCountdownTimer(initialCountdown);
  const gameEnd = inputDisabled || (minutesLeft <= 0 && secondsLeft <= 0);
  useEffect(() => {
    if (gameEnd === false) {
      return;
    }
    const correctWords = displayTokens.filter(
      (token) => token.state === 'correct'
    ).length;

    const elapsedSeconds =
      initialCountdown.seconds - (minutesLeft * 60 + secondsLeft);

    const totalWords = displayTokens.filter(
      (token) =>
        token.word !== ' ' &&
        (token.state === 'correct' || token.state === 'incorrect')
    ).length;

    const score = calculateGameScore(totalWords, elapsedSeconds, correctWords);

    let timeout;
    if (isNaN(score.netWPM) === false) {
      setScore(score);
      addToList('WPM_SCORE', {
        label: new Date().toLocaleDateString(),
        value: Math.floor(score.netWPM),
      });
      timeout = setTimeout(() => {
        setShowScoreBoard(true);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [gameEnd]);

  useEffect(() => {
    const disableInput = !timerStarted;
    setInputDisabled(disableInput);
  }, [timerStarted]);

  useEffect(() => {
    document.querySelector('body').classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

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
          tokens[0].state = 'current';
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

  const handleRestartGame = () => {
    setShowScoreBoard(false);
    restoreDefaultTime();
    setLoading(true);
  };
  const handleSelectedTimeoutChange = (seconds) => {
    setInitialCountdown({
      seconds,
    });
  };

  return (
    <div className={`container`}>
      {showScoreBoard && (
        <Scoreboard
          onRestartGame={handleRestartGame}
          grossWPM={score.grossWPM}
          accuracy={score.accuracy}
          netWPM={score.netWPM}
        >
          <BarChart
            labels={getValues(getList('WPM_SCORE'), 'label')}
            data={getValues(getList('WPM_SCORE'), 'value')}
          />
        </Scoreboard>
      )}
      {!showScoreBoard && (
        <div className='typing-container'>
          <div className='typing-header'>
            <SelectMenu
              disabled={timerStarted}
              items={TIMEOUT_SELECTIONS}
              onChange={handleSelectedTimeoutChange}
              currentValue={initialCountdown.seconds}
            />
            <Toggle checked={darkMode} onToggle={toggleDarkMode} />
          </div>
          <Timer minutes={minutesLeft} seconds={secondsLeft} />
          <div className='word-display-container'>
            {loading && <Loader />}
            {!loading && (
              <WordsDisplay refresh={!inputDisabled} tokens={displayTokens} />
            )}
          </div>
          <WordsInput
            disabled={inputDisabled}
            onTextChanged={handleTextChanged}
            clearText={!loading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
