import express from 'express';
import slotController from '../controllers/slot.controller';

const router = express.Router();

router.post('/spin', [], slotController.Get);
router.get('/', (req, res) => {
    res.send('Server running!');
});

export default router;
