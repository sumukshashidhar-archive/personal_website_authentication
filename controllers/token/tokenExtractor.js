module.exports = function (header) {
  try {
    if (header.startsWith("Bearer ")) {
      return header.substring(7, header.length);
    }
    return false;
  } catch (e) {
    return false;
  }
};
