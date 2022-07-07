import React from 'react';
function Scoreboard({
  grossWPM,
  accuracy,
  netWPM,
  onRestartGame,
}) {
  return (
    <div className='scoreboard'>
      <h2>Your Score: </h2>
      <div className='score'>
        <span className='score-label'>Typing Speed: </span>
        <span>{Math.floor(grossWPM)}</span>
        <span> WPM</span>
      </div>
      <div className='score'>
        <span className='score-label'>Accuracy: </span> {accuracy.toFixed(2)}
      </div>
      <div className='score'>
        <span className='score-label'>Net Speed: </span> {Math.floor(netWPM)}
        <span> WPM</span>
      </div>
      <div className='btn-group'>
        <button className='btn btn-primary' onClick={onRestartGame}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default Scoreboard;
