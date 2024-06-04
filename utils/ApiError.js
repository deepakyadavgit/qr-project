class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    // this.message = message
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

export const CatchError = (error, res) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
      errors: error?.errors || [],
    });
  }
};
