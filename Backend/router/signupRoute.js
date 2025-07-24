import express from 'express'
import {handleSignUp} from '../controllers/signUpController.js'

const router = express.Router();

router.post('/', handleSignUp)

export default router; 