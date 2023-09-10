class APIError extends Error {
  constructor(message, code) {
    // j'appelle le constructeur du parent
    super(message);
    this.code = code;
    this.date = new Date();
  }
}

module.exports = APIError;
