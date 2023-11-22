class BaseURL {
  static async encode(url, encoding = "base64") {
    try {
      const response = await fetch(url);

      const blob = await response.arrayBuffer();
      return blob;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = BaseURL;
