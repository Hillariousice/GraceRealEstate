import express from 'express'
import {  CreateSuperadmin,CreateAdmin, CreateAgent, getAllAgents,agentGet, agentDelete} from '../controller/adminController'
import { auth, adminAuth } from '../middleware/auth' // Import adminAuth
import { upload } from '../utils/multer'
const router = express.Router()



router.get('/get-all-agents', adminAuth, getAllAgents) // Changed to adminAuth
router.get('/get-all-agent/:_id', adminAuth, agentGet) // Should be adminAuth if only admins can get specific agent details

router.post('/create-superadmin', CreateSuperadmin) // Still needs protection, e.g., superAdminAuth or IP restriction
router.post('/create-admin', adminAuth, CreateAdmin) // adminAuth (controller ensures superadmin)
router.post('/create-agent', adminAuth, CreateAgent) // adminAuth (controller ensures admin or superadmin)
router.delete('/deleteAgent/:_id', adminAuth, agentDelete) // adminAuth
export default router