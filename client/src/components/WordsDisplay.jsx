import React, { useCallback } from 'react';

function WordsDisplay({ refresh, tokens }) {
  const spanRef = useCallback((span) => {
    if (span == null) {
      return;
    }
    span.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const containerRef = useCallback(
    (container) => {
      if (container == null) {
        return;
      }
      container.scrollTop = -100;
    },
    [refresh]
  );

  return (
    <>
      <div className='words-display' ref={containerRef}>
        {tokens.map((token, index) => (
          <span
            ref={token.state === 'current' ? spanRef : null}
            key={index}
            className={`${token.state}`}
          >
            {token.word}
          </span>
        ))}
      </div>
    </>
  );
}

export default WordsDisplay;
