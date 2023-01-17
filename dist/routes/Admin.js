"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/get-all-agents', auth_1.auth, adminController_1.getAllAgents);
router.get('/get-all-agent/:_id', auth_1.auth, adminController_1.agentGet);
router.post('/create-superadmin', adminController_1.CreateSuperadmin);
router.post('/create-admin', auth_1.auth, adminController_1.CreateAdmin);
router.post('/create-agent', auth_1.auth, adminController_1.CreateAgent);
router.delete('/deleteAgent/:_id', auth_1.auth, adminController_1.agentDelete);
exports.default = router;
