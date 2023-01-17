"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controller/agentController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.get('/get-all-property', auth_1.authAgent, agentController_1.getAllProperty);
router.get('/get-property/:_id', auth_1.authAgent, agentController_1.propertyGet);
router.patch('/update-agent/:_id', auth_1.authAgent, multer_1.upload.single('coverImage'), agentController_1.agentUpdate);
router.post('/login', agentController_1.agentLogin);
router.post('/create-property', auth_1.authAgent, multer_1.upload.single('image'), agentController_1.CreateProperty);
router.patch('/updateProperty/:_id', auth_1.authAgent, multer_1.upload.single('image'), agentController_1.propertyUpdate);
router.delete('/deleteProperty/:_id', auth_1.authAgent, agentController_1.propertyDelete);
exports.default = router;
