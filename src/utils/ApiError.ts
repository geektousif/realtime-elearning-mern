import { ErrorNames, ErrorStatusCodes } from "../constants/enums";

class BaseError extends Error {
  // name: string;
  statusCode: number;
  data: any;
  success: boolean;
  // errors: any;

  constructor(
    // name: string,
    statusCode: number,
    message: string /*, errors: any */
  ) {
    super(message);
    // this.name = name;
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    // this.errors = errors;
    // if (stack) {
    //   this.stack = stack;
    // } else {
    // Error.captureStackTrace(this, this.constructor);
    // }
  }
}

class ApiError extends BaseError {
  constructor(statusCode = 500, message = "Something Went Wrong") {
    super(statusCode, message);
  }
}

// class BadRequestError extends BaseError {
//   constructor(message = "Bad Request Error") {
//     super(ErrorNames.BAD_REQUEST, ErrorStatusCodes.BAD_REQUEST, message);
//   }
// }

// class NotFoundError extends BaseError {
//   constructor(message = "Not Found Error") {
//     super(ErrorNames.NOT_FOUND, ErrorStatusCodes.NOT_FOUND, message);
//   }
// }

export { ApiError };
