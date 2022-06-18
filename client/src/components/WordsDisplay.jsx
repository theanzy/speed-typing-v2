import React from 'react';

function WordsDisplay({ tokens }) {
  return (
    <div>
      {tokens.map((token, index) => (
        <span key={index} className={`${token.state}`}>
          {token.word}
        </span>
      ))}
    </div>
  );
}

export default WordsDisplay;
