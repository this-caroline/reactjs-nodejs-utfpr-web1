export const getUniqueObject = (arr, key) => {

  // 1. store the comparison values in array
  // 2. store the indexes of the unique objects
  // 3. eliminate the false indexes & return unique objects
  const unique =  arr
    .map(e => e[key])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e]).map(e => arr[e]);

  return unique;
};
