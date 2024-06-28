import express from "express";
import slotController from "../controllers/slot.controller";
import { validateBetAmount } from "../middlewares/validateBetAmount.middleware";

const router = express.Router();

router.post("/spin", validateBetAmount, slotController.Post);
router.post("/double", validateBetAmount, slotController.PostDouble);

export default router;
