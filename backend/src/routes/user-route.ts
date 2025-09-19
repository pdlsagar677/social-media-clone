import express from 'express';
import { register,login ,logout, getProfile, getSuggestedUsers, followOrUnfollow, editProfile} from '../controllers/user-controller';
import isAuthenticated from '../middlewares/isAuthenticated';
import { uploadProfilePicture } from '../middlewares/multer';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated , getProfile);
router.post('/profile/edit', isAuthenticated , uploadProfilePicture, editProfile);
router.get('/suggested', isAuthenticated , getSuggestedUsers);
router.post('/followorunfollow/:id', isAuthenticated , followOrUnfollow);




export default router;