import express from 'express'
import {  CreateSuperadmin } from '../controller/adminController'
import { auth } from '../middleware/auth'
import { upload } from '../utils/multer'
const router = express.Router()

router.post('/create-superadmin',CreateSuperadmin)
export default router