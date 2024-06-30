import { Request, Response } from 'express';
import {
    doubleOrNothing,
    play,
} from '../operations/slotMachine/slotLogic.operation';

const Post = (req: Request, res: Response) => {
    const { betAmount } = req.body;

    const [win, payout, reels] = play(betAmount);

    res.json({
        win,
        payout,
        reels,
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
