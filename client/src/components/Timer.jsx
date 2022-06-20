import React from 'react';

function padZeros(number, n) {
  return String(number).padStart(n, '0');
}

function Timer({ minutes, seconds }) {
  return (
    <div className='timer'>
      {padZeros(minutes, 2)}:{padZeros(seconds, 2)}
    </div>
  );
}

export default Timer;
