export const populateArray = (size: number, multiplier = 1) => [...Array(size)]
  .map((_, i) => i * multiplier);

export const shuffleArray = (array: number[]) => {
  const result = [...array];
  // eslint-disable-next-line no-plusplus
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};

export const isServer = !(
  typeof window !== 'undefined'
  && window.document
  && window.document.createElement
);
