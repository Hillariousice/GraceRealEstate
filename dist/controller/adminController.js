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
exports.CreateSuperadmin = void 0;
const utils_1 = require("../utils/utils");
const UserModel_1 = __importDefault(require("../model/UserModel"));
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
