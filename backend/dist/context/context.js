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
exports.createContext = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
dotenv_1.default.config();
const createContext = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
    var _b;
    const token = ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) || '';
    let user = null;
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            user = yield db_1.db.user.findUnique({
                where: {
                    id: payload.id
                }
            });
        }
        catch (e) {
            user = null;
        }
    }
    return {
        req,
        res,
        db: db_1.db,
        user,
    };
});
exports.createContext = createContext;
