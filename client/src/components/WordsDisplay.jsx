import React, { useCallback } from 'react';

function WordsDisplay({ tokens, currentIndex }) {
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
          ref={index === currentIndex ? spanRef : null}
          key={index}
          className={`${token.state}`}>
          {token.word}
        </span>
      ))}
    </div>
  );
}

export default WordsDisplay;
