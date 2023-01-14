import express from 'express'
import { getAllUsers, Login, Register, userDelete, userGet, userUpdate } from '../controller/userController'
import { auth } from '../middleware/auth'
import { upload } from '../utils/multer'
const router = express.Router()


router.post('/signin',Register)
router.post('/login',Login)

router.get('/get-all-users', auth, getAllUsers)
router.get('/get-all-user/:_id',auth, userGet)

router.patch('/updateUser/:_id',auth,upload.single('coverImage'),userUpdate)
router.delete('/deleteUser/:_id',auth,userDelete)


export default router