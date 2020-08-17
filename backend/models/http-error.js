class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Message property
    this.code = errorCode;
  }
}

module.exports = HttpError;
