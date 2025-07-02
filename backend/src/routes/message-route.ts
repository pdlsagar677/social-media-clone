import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getMessage, sendMessage } from "../controllers/message-controller";

const router = express.Router();

// Routes now work with standard Request/Response types
router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);

export default router;