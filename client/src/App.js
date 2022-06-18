import { useState } from 'react';
import Timer from './components/Timer';
import WordsDisplay from './components/WordsDisplay';
import WordsInput from './components/WordsInput';
import './styles.css';

function App() {
  const text =
    'It has long been an axiom of mine that the little things are infinitely the most important. The day of fortune is like a harvest day, we must be busy when the corn is ripe. The invariable mark of wisdom is to see the miraculous in the common. Wherever you go, go with all your heart. Coming together is a beginning.';
  const [displayTokens, setDisplayTokens] = useState(
    text.split(/(\s{1})/).map((word) => {
      return {
        state: '',
        word,
      };
    })
  );

  function handleTextChanged(e) {
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
    if (newTokens[currentIndex] != undefined) {
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
  }

  return (
    <div className='container'>
      <div className='typing-container'>
        <Timer />
        <WordsDisplay tokens={displayTokens} />
        <WordsInput onTextChanged={handleTextChanged} />
      </div>
    </div>
  );
}

export default App;
