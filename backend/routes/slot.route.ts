import express from "express";
import slotController from "../controllers/slot.controller";

const router = express.Router();

router.post("/spin", [], slotController.Post);

export default router;
