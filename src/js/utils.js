// const classReg = /[^,/*{}\s]+(?![^{]*})/g;
// const classReg = /(?!\s)[^,()/*{}]+(?![^{]*})/g;
const classReg = /(?!\s)[^,()/*{}]+(?![^{]*})/g;

export function prefix(str, exerciseKey) {
  return str.replaceAll(
    classReg,
    (match) => `[data-exercise-key="${exerciseKey}"] .output ${match}`
  );
}
