import { Request, Response } from "express";
import { doubleOrNothing, play } from "../operations/slotMachine/slotLogic.operation";

const Post = (req: Request, res: Response) => {
  const { betAmount } = req.body;

  const [win, payout, [reel1, reel2, reel3]] = play(betAmount);

  res.json({
    win,
    payout,
    reels: {
      reel1,
      reel2,
      reel3,
    },
  });
};

const PostDouble = (req: Request, res: Response) => {
  const { betAmount } = req.body;

  const [result, payout] = doubleOrNothing(betAmount);

  res.json({
    result,
    payout,
  });
};

export default { Post, PostDouble };
