"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDelete = exports.userUpdate = exports.userGet = exports.getAllUsers = exports.Login = exports.Register = void 0;
const utils_1 = require("../utils/utils");
const UserModel_1 = __importDefault(require("../model/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, confirm_password, phone } = req.body;
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = yield (0, utils_1.GenerateSalt)();
        // console.log(salt)
        const hashedPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //  console.log(hashedPassword)
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            yield UserModel_1.default.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword,
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user",
                coverImage: ""
            });
            const userExist = yield UserModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'User registered',
                userExist
            });
        }
        res.status(400).json({
            message: 'User already exist',
            Error: 'User already exist'
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/signin"
        });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const user = yield UserModel_1.default.findOne({ email });
        if (user) {
            const validate = yield bcryptjs_1.default.compare(password, user.password);
            if (validate) {
                const token = yield (0, utils_1.generateToken)(`${user._id}`);
                res.cookie('token', token);
                return res.status(200).json({
                    message: 'User logged in',
                    role: user.role,
                    email: user.email,
                    verified: user.verified,
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password or not a verified user ",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/login"
        });
    }
});
exports.Login = Login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.default.find({});
        res.status(200).json({
            message: "Here Is All Users",
            users
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-all-users"
        });
    }
});
exports.getAllUsers = getAllUsers;
const userGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const user = yield UserModel_1.default.findOne({ _id: id });
        if (user) {
            res.status(200).json({
                message: 'Here Is Your User',
                user
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-all-users/:_id"
        });
    }
});
exports.userGet = userGet;
const userUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const { firstName, lastName, address, gender, phone, coverImage } = req.body;
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const user = yield UserModel_1.default.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedUser = yield UserModel_1.default.findOneAndUpdate({ _id: id }, {
            firstName, lastName, address, gender, phone,
            coverImage: req.file.path
        });
        if (updatedUser) {
            const user = yield UserModel_1.default.findOne({ _id: id });
            res.status(200).json({
                message: 'User updated',
                user
            });
        }
        return res.status(400).json({
            message: "Error occurred",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/updateUser/:_id"
        });
    }
});
exports.userUpdate = userUpdate;
const userDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const user = yield UserModel_1.default.findByIdAndDelete({ _id: id });
        if (user) {
            return res.status(200).json({
                message: 'User deleted successfully'
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/deleteUser/:_id"
        });
    }
});
exports.userDelete = userDelete;
