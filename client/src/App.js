import Timer from './components/Timer';
import WordsDisplay from './components/WordsDisplay';
import WordsInput from './components/WordsInput';
import './styles.css';
const text =
  'It has long been an axiom of mine that the little things are infinitely the most important. The day of fortune is like a harvest day, we must be busy when the corn is ripe. The invariable mark of wisdom is to see the miraculous in the common. Wherever you go, go with all your heart. Coming together is a beginning';
function App() {
  return (
    <div className='container'>
      <div className='typing-container'>
        <Timer />
        <WordsDisplay text={text} />
        <WordsInput />
      </div>
    </div>
  );
}

export default App;
