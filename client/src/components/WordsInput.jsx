import React from 'react';

function WordsInput({ onTextChanged }) {
  const handleInputChanged = (e) => {
    onTextChanged({ type: e.nativeEvent.inputType, data: e.target.value });
  };
  return (
    <textarea className='words-input' onChange={handleInputChanged}></textarea>
  );
}

export default WordsInput;
