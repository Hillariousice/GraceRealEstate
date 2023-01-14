"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post('/signin', userController_1.Register);
router.post('/login', userController_1.Login);
router.get('/get-all-users', auth_1.auth, userController_1.getAllUsers);
router.get('/get-all-user/:_id', auth_1.auth, userController_1.userGet);
router.patch('/updateUser/:_id', auth_1.auth, multer_1.upload.single('coverImage'), userController_1.userUpdate);
router.delete('/deleteUser/:_id', auth_1.auth, userController_1.userDelete);
exports.default = router;
