"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const User_1 = __importDefault(require("./routes/User"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const Agent_1 = __importDefault(require("./routes/Agent"));
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_1.connectDB)();
//middleware
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(process.cwd(), './public')));
//Routes
app.use('/users', User_1.default);
app.use('/admins', Admin_1.default);
app.use('/agents', Agent_1.default);
app.listen(process.env.PORT, () => { console.log(`app running on ${process.env.PORT}`); });
exports.default = app;
