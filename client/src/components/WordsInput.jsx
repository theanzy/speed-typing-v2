import React, { useCallback } from 'react';

function WordsInput({ onTextChanged, disabled, clearText }) {
  const handleInputChanged = (e) => {
    onTextChanged({ type: e.nativeEvent.inputType, data: e.target.value });
  };
  const textAreaRef = useCallback(
    (node) => {
      if (node == null) {
        return;
      }
      node.focus();
      if (clearText) {
        node.value = null;
      }
    },
    [clearText]
  );
  return (
    <textarea
      ref={textAreaRef}
      disabled={disabled}
      className='words-input'
      onChange={handleInputChanged}></textarea>
  );
}

export default WordsInput;
