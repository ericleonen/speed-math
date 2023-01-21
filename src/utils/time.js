export const getSeconds = ms => {
return Math.floor(ms / 1000);
};
  
export const getMilliseconds = ms => {
    const s = ("" + Math.round(100 * ((ms / 1000) % 1)) / 100).slice(2);
    return s;
};