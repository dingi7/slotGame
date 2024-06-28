import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const validateBetAmount = (req: Request, res: Response, next: NextFunction) => {
  const { betAmount } = req.body;

  if (!betAmount) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Required betAmount in body" });
    return;
  }

  next();
};
