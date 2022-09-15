import React from 'react';

function SelectMenu({ disabled, items, onChange, currentValue }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div>
      <select
        disabled={disabled}
        className='select-items'
        name='items'
        onChange={handleChange}
        value={currentValue}
      >
        {items.map((item) => (
          <option key={item.display} value={item.value}>
            {item.display}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectMenu;
