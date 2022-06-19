import React, { useCallback } from 'react';

function WordsInput({ onTextChanged, disabled }) {
  const handleInputChanged = (e) => {
    onTextChanged({ type: e.nativeEvent.inputType, data: e.target.value });
  };
  const textAreaRef = useCallback((node) => {
    if (node == null) {
      return;
    }
    node.focus();
  }, []);
  return (
    <textarea
      ref={textAreaRef}
      disabled={disabled}
      className='words-input'
      onChange={handleInputChanged}></textarea>
  );
}

export default WordsInput;
