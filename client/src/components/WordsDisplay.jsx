import React, { useCallback } from 'react';

function WordsDisplay({ tokens }) {
  const spanRef = useCallback((span) => {
    if (span == null) {
      return;
    }
    span.scrollIntoView({ behavior: 'smooth' });
  }, []);
  return (
    <div className='words-display'>
      {tokens.map((token, index) => (
        <span
          ref={token.state === 'current' ? spanRef : null}
          key={index}
          className={`${token.state}`}>
          {token.word}
        </span>
      ))}
    </div>
  );
}

export default WordsDisplay;
