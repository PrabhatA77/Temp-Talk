import express from 'express';
import { signup,verifyEmail,login,logout} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

router.post('/verify-email',verifyEmail);

export default router;