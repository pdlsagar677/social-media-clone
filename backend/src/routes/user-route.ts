import express from 'express';
import { register,login ,logout, getProfile} from '../controllers/user-controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import { uploadProfilePicture } from '../middlewares/multer';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated , getProfile);
router.get('/profile/edit', isAuthenticated , uploadProfilePicture);




export default router;