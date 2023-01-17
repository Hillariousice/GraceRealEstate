import express from 'express'
import { agentLogin, agentUpdate,CreateProperty, getAllProperty,propertyGet,propertyUpdate,propertyDelete} from '../controller/agentController'
import { authAgent } from '../middleware/auth'
import { upload } from '../utils/multer'
const router = express.Router()

router.get('/get-all-property', authAgent, getAllProperty)
router.get('/get-property/:_id',authAgent, propertyGet)

router.patch('/update-agent/:_id',authAgent,upload.single('coverImage'),agentUpdate)
router.post('/login',agentLogin)
router.post('/create-property',authAgent,upload.single('image'),CreateProperty)

router.patch('/updateProperty/:_id',authAgent,upload.single('image'),propertyUpdate)
router.delete('/deleteProperty/:_id',authAgent,propertyDelete)
export default router