import express from 'express'
import { getAllUsers, getFavorites, getProperties, Login, Register, toggleFavorite, userDelete, userGet, userUpdate } from '../controller/userController'
import { propertyGet } from '../controller/agentController'
import { createPaymentIntent } from '../controller/paymentController'
import { auth, adminAuth } from '../middleware/auth' // Import adminAuth
import { upload } from '../utils/multer'
const router = express.Router()


router.post('/signup',Register)
router.post('/login',Login)

// Property routes (public)
router.get('/properties', getProperties)
router.get('/property/:propertyId', propertyGet)

// User specific routes
// Get own profile (or specific user if also admin - handled by controller or separate route)
router.get('/get-all-user/:_id', auth, userGet)
router.patch('/updateUser/:_id', auth, upload.single('coverImage'), userUpdate)

// Favorites routes
router.post('/toggle-favorite/:propertyId', auth, toggleFavorite)
router.get('/favorites', auth, getFavorites)

// Payment routes
router.post('/checkout/:propertyId', auth, createPaymentIntent)

// Admin specific user routes
router.get('/get-all-users', adminAuth, getAllUsers) // Changed to adminAuth
router.delete('/deleteUser/:_id', adminAuth, userDelete) // Changed to adminAuth


export default router