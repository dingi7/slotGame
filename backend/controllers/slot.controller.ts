import { Request, Response } from "express";
import { play } from "../operations/slotMachine/slotLogic.operation";
import { StatusCodes } from "http-status-codes";

const Get = (req: Request, res: Response) => {
  const { betAmount } = req.body;

  // may potentially be extracted as a global validation utility in the future for all APIs handling data from the body.
  if (!betAmount) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Required betAmount in body" });
    return;
  }

  const [payout, [reel1, reel2, reel3]] = play(betAmount);

  res.json({
    payout,
    reels: {
      reel1,
      reel2,
      reel3,
    },
  });
};
export default { Get };
