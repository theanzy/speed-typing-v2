import React from 'react';

function WordsInput({ onTextChanged }) {
  const handleInputChanged = (e) => {
    onTextChanged({ type: e.nativeEvent.inputType, data: e.target.value });
  };
  return (
    <div>
      <textarea onChange={handleInputChanged}></textarea>
    </div>
  );
}

export default WordsInput;
