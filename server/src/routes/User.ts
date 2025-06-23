import express from 'express'
import { getAllUsers, Login, Register, userDelete, userGet, userUpdate } from '../controller/userController'
import { propertyGet } from '../controller/agentController' // Import propertyGet
import { auth } from '../middleware/auth'
import { upload } from '../utils/multer'
const router = express.Router()


router.post('/signup',Register)
router.post('/login',Login)

// Property route (public)
router.get('/property/:propertyId', propertyGet) // New public route for fetching a single property

// User specific routes (mostly authenticated)
router.get('/get-all-users', auth, getAllUsers)
router.get('/get-all-user/:_id',auth, userGet) // Note: path has /:id, maybe should be /profile or similar if for self

router.patch('/updateUser/:_id',auth,upload.single('coverImage'),userUpdate)
router.delete('/deleteUser/:_id',auth,userDelete)


export default router