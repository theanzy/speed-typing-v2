import React from 'react';
import './Toggle.css';
function Toggle({ checked, onToggle }) {
  return (
    <div className='toggle-switch' onClick={onToggle}>
      <input type='checkbox' checked={checked} />
      <div class='slider round'></div>
    </div>
  );
}

export default Toggle;
