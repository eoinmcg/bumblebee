/**
 * Collection of small functions to make life easier
 * 
 */
export const Helpers = {
  /**
  * generates a random number
  * 
  * @param {number} min
  * @param {number} max
  * @returns {number} - True if objects are colliding, false otherwise
  */
  rnd: function (min = 0, max  = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /**
  * plucks random value from array
  * 
  * @param {arrary} a
  * @returns {mixed}
  */
  rndArray: function (a) {
    return a[~~(Math.random() * a.length)];
  },

  /**
  * clamps number in range
  * 
  * @param {number} min
  * @param {number} max
  * @returns {number}
  */
  clamp: function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
};
