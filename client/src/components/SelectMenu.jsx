import React from 'react';

function SelectMenu({ enabled, items, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div>
      <select
        disabled={!enabled}
        className='select-items'
        name='items'
        onChange={handleChange}>
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
