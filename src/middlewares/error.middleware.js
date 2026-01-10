import { StatusCodes } from "http-status-codes";

export default (err, req, res, next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
  });
};
