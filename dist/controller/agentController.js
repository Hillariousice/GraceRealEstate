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
exports.propertyDelete = exports.propertyUpdate = exports.propertyGet = exports.getAllProperty = exports.CreateProperty = exports.agentUpdate = exports.agentLogin = void 0;
const AgentModel_1 = __importDefault(require("../model/AgentModel"));
const PropertyModel_1 = __importDefault(require("../model/PropertyModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
const agentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const agent = yield AgentModel_1.default.findOne({ email });
        if (agent) {
            const validate = yield bcryptjs_1.default.compare(password, agent.password);
            if (validate) {
                const token = yield (0, utils_1.generateToken)(`${agent._id}`);
                res.cookie('token', token);
                return res.status(200).json({
                    message: 'User logged in',
                    role: agent.role,
                    email: agent.email,
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong agent-name or password or not a verified agent ",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/login"
        });
    }
});
exports.agentLogin = agentLogin;
const agentUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const { name, companyName, address, email, phone, pincode, coverImage } = req.body;
        const validateResult = utils_1.updateAgentSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const agent = yield AgentModel_1.default.findOne({ _id: id });
        console.log(agent);
        if (!agent) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedAgent = yield AgentModel_1.default.findOneAndUpdate({ _id: id }, {
            name, companyName, address, email, phone, pincode,
            coverImage: req.file.path
        });
        console.log(updatedAgent);
        if (updatedAgent) {
            const agent = yield AgentModel_1.default.findOne({ _id: id });
            res.status(200).json({
                message: 'Agent updated',
                agent
            });
        }
        return res.status(400).json({
            message: "Error occurred",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/updateAgent/:_id"
        });
    }
});
exports.agentUpdate = agentUpdate;
const CreateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.agent._id;
        console.log(_id);
        const { name, description, address, category, price, image } = req.body;
        const agent = yield AgentModel_1.default.findOne({ _id });
        if (agent) {
            const createproperty = yield PropertyModel_1.default.create({
                name,
                address,
                description,
                category,
                propertySize: "",
                condition: "",
                price,
                rating: 0,
                agentId: _id,
                image: req.file.path
            });
            return res.status(201).json({
                message: 'Property Created',
                createproperty
            });
        }
        return res.status(400).json({
            message: "Error occurred",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/create-property"
        });
    }
});
exports.CreateProperty = CreateProperty;
const getAllProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield PropertyModel_1.default.find({});
        return res.status(200).json({
            message: "Here Is All Property",
            property
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/admins/get-all-property"
        });
    }
});
exports.getAllProperty = getAllProperty;
const propertyGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const agent = yield PropertyModel_1.default.findOne({ _id: id });
        if (agent) {
            return res.status(200).json({
                message: 'Here Is Your Property',
                agent
            });
        }
        return res.status(400).json({
            message: "Property not found",
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            Error: "/users/get-property"
        });
    }
});
exports.propertyGet = propertyGet;
const propertyUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const { name, description, address, category, price, propertySize, condition, image } = req.body;
        const validateResult = utils_1.updatePropertySchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const property = yield PropertyModel_1.default.findOne({ _id: id });
        console.log(property);
        if (!property) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedProperty = yield PropertyModel_1.default.findOneAndUpdate({ _id: id }, {
            name, description, address, category, price, propertySize, condition,
            image: req.file.path
        });
        console.log(updatedProperty);
        if (updatedProperty) {
            const property = yield PropertyModel_1.default.findOne({ _id: id });
            return res.status(200).json({
                message: 'Property updated',
                property
            });
        }
        return res.status(400).json({
            message: "Error occurred",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/updateProperty/:_id"
        });
    }
});
exports.propertyUpdate = propertyUpdate;
const propertyDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params._id;
        const property = yield PropertyModel_1.default.findByIdAndDelete({ _id: id });
        if (property) {
            return res.status(200).json({
                message: 'Property deleted successfully'
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: "/agents/deleteProperty/:_id"
        });
    }
});
exports.propertyDelete = propertyDelete;
