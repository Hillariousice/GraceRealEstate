import express from 'express'
import {  CreateSuperadmin,CreateAdmin, CreateAgent, getAllAgents,agentGet, agentDelete} from '../controller/adminController'
import { auth } from '../middleware/auth'
import { upload } from '../utils/multer'
const router = express.Router()



router.get('/get-all-agents', auth, getAllAgents)
router.get('/get-all-agent/:_id',auth, agentGet)

router.post('/create-superadmin',CreateSuperadmin)
router.post('/create-admin',auth,CreateAdmin)
router.post('/create-agent',auth,CreateAgent)
router.delete('/deleteAgent/:_id',auth,agentDelete)
export default router