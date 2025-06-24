import express from 'express';
import { register,login ,logout, getProfile} from '../controllers/user-controller';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated , getProfile);




export default router;