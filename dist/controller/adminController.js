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
exports.agentDelete = exports.agentGet = exports.getAllAgents = exports.CreateAgent = exports.CreateAdmin = exports.CreateSuperadmin = void 0;
const utils_1 = require("../utils/utils");
const UserModel_1 = __importDefault(require("../model/UserModel"));
const AgentModel_1 = __importDefault(require("../model/AgentModel"));
const CreateSuperadmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = yield (0, utils_1.GenerateSalt)();
        // console.log(salt)
        const superadminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //  console.log(hashedPassword)
        const superadmin = yield UserModel_1.default.findOne({ email });
        if (!superadmin) {
            yield UserModel_1.default.create({
                firstName,
                lastName,
                email,
                password: superadminPassword,
                confirm_password: superadminPassword,
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin",
                coverImage: ""
            });
            const superAdminExist = yield UserModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'User registered',
                superAdminExist
            });
        }
        return res.status(400).json({
            message: 'Superadmin already exist',
            Error: 'Superadmin already exist'
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-superadmin"
        });
    }
});
exports.CreateSuperadmin = CreateSuperadmin;
const CreateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.user._id;
        const { firstName, lastName, email, password, phone } = req.body;
        console.log(req.body);
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = yield (0, utils_1.GenerateSalt)();
        // console.log(salt)
        const superadminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //  console.log(hashedPassword)
        const Admin = yield UserModel_1.default.findOne({ _id });
        if ((Admin === null || Admin === void 0 ? void 0 : Admin.email) === email) {
            return res.status(400).json({
                message: "Email Already exist",
            });
        }
        if ((Admin === null || Admin === void 0 ? void 0 : Admin.phone) === phone) {
            return res.status(400).json({
                message: "Phone number  already exist",
            });
        }
        //Create Admin
        if ((Admin === null || Admin === void 0 ? void 0 : Admin.role) === "superadmin") {
            yield UserModel_1.default.create({
                firstName,
                lastName,
                email,
                password: superadminPassword,
                confirm_password: superadminPassword,
                phone,
                address: "",
                gender: "",
                salt,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
                coverImage: ""
            });
            // check if the admin exist
            const Admin = (yield UserModel_1.default.findOne({
                _id: _id
            }));
            return res.status(201).json({
                message: "Admin created successfully",
                verified: Admin === null || Admin === void 0 ? void 0 : Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-admin"
        });
    }
});
exports.CreateAdmin = CreateAdmin;
const CreateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.user._id;
        const { name, companyName, email, password, phone } = req.body;
        console.log(req.body);
        const validateResult = utils_1.agentSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = yield (0, utils_1.GenerateSalt)();
        // console.log(salt)
        const agentPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        const agent = yield AgentModel_1.default.findOne({ email });
        const Admin = yield UserModel_1.default.findOne({ _id });
        if ((Admin === null || Admin === void 0 ? void 0 : Admin.role) === "admin" || (Admin === null || Admin === void 0 ? void 0 : Admin.role) === "superadmin") {
            if (!agent) {
                const createAgent = yield AgentModel_1.default.create({
                    name,
                    companyName,
                    pincode: "",
                    phone,
                    address: "",
                    email,
                    password: agentPassword,
                    salt,
                    serviceAvailable: false,
                    rating: 0,
                    role: "agent",
                    coverImage: ""
                });
                return res.status(201).json({
                    message: "Agent created successfully",
                    createAgent,
                });
            }
            return res.status(400).json({
                message: "Agent already exist",
            });
        }
        return res.status(400).json({
            message: "unathorised",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/create-agent"
        });
    }
});
exports.CreateAgent = CreateAgent;
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield AgentModel_1.default.find({});
        res.status(200).json({
            message: "Here Is All Agents",
            agents
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/get-all-agents"
        });
    }
});
exports.getAllAgents = getAllAgents;
const agentGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const agent = yield AgentModel_1.default.findOne({ _id: id });
        if (agent) {
            res.status(200).json({
                message: 'Here Is Your User',
                agent
            });
        }
        return res.status(400).json({
            message: "Agent not found",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-agent"
        });
    }
});
exports.agentGet = agentGet;
const agentDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const agent = yield AgentModel_1.default.findByIdAndDelete({ _id: id });
        if (agent) {
            return res.status(200).json({
                message: 'Agent deleted successfully'
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/deleteAgent/:_id"
        });
    }
});
exports.agentDelete = agentDelete;
