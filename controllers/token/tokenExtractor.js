module.exports = function (header) {
  try {
    console.log(header);
    if (header.startsWith("Bearer ")) {
      return header.substring(7, header.length);
    }
    return false;
  } catch (e) {
    return false;
  }
};
