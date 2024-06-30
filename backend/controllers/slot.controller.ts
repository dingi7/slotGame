import { Request, Response } from "express";
import { doubleOrNothing, play } from "../operations/slotMachine/slotLogic.operation";

const Post = (req: Request, res: Response) => {
  const { betAmount } = req.body;

  const [win, payout, [reel1_1, reel1_2, reel1_3, reel2_1, reel2_2, reel2_3, reel3_1, reel3_2, reel3_3]] = play(betAmount);

  res.json({
    win,
    payout,
    reels: {
      reel1_1,
      reel1_2,
      reel1_3,
      reel2_1,
      reel2_2,
      reel2_3,
      reel3_1,
      reel3_2,
      reel3_3,
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
