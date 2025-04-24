export const Helpers = {
  rnd: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  rndArray: function (a) {
    return a[~~(Math.random() * a.length)];
  },
  clamp: function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
};

