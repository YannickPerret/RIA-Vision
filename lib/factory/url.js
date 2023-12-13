class BaseURL {
  static async encode(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = BaseURL;
