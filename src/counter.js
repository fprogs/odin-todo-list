/* eslint-disable import/prefer-default-export */
/* eslint-disable no-plusplus */
function Counter() {
  let count = 0;

  function increment() {
    return count++;
  }

  function reset() {
    count = 0;
  }

  return { increment, reset };
}

export { Counter };
